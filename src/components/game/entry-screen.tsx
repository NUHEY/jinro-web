"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGame } from "@/hooks/use-game";
import { useLocale } from "@/lib/i18n/locale-context";
import { loadLastName } from "@/lib/session";
import { LanguageSwitcher } from "@/components/game/language-switcher";
import { HelpDialog } from "@/components/game/help-dialog";

export function EntryScreen() {
  const { createRoom, joinRoom } = useGame();
  const { t } = useLocale();
  const searchParams = useSearchParams();
  const prefillCode = (searchParams.get("code") ?? "").toUpperCase().slice(0, 8);

  const [name, setName] = useState(() => loadLastName());
  const [code, setCode] = useState(prefillCode);
  const [customCode, setCustomCode] = useState("");
  const [tab, setTab] = useState(prefillCode ? "join" : "create");
  const [busy, setBusy] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) return;
    setBusy(true);
    await createRoom(name.trim(), customCode.trim() || undefined);
    setBusy(false);
  };

  const handleJoin = async () => {
    if (!name.trim() || code.trim().length < 4) return;
    setBusy(true);
    await joinRoom(code.trim().toUpperCase(), name.trim());
    setBusy(false);
  };

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-10 safe-top safe-bottom">
      <div className="mb-2 flex w-full max-w-sm items-center justify-between">
        <HelpDialog trigger={<Button variant="ghost" size="sm">{t.entry.helpButton}</Button>} />
        <LanguageSwitcher />
      </div>

      <div className="mb-8 flex flex-col items-center gap-3 text-center">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/15 text-primary ring-1 ring-primary/30">
          <Moon className="size-8" />
        </div>
        <h1 className="font-heading text-3xl font-bold tracking-tight">{t.entry.title}</h1>
        <p className="max-w-xs text-sm text-muted-foreground">{t.entry.subtitle}</p>
      </div>

      <Card className="w-full max-w-sm border-border/70 bg-card/80 backdrop-blur">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">{t.entry.cardTitle}</CardTitle>
          <CardDescription>{t.entry.cardDesc}</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={tab} onValueChange={setTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="create">{t.entry.tabCreate}</TabsTrigger>
              <TabsTrigger value="join">{t.entry.tabJoin}</TabsTrigger>
            </TabsList>

            <div className="mt-4 space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="name">{t.entry.nameLabel}</Label>
                <Input
                  id="name"
                  value={name}
                  maxLength={16}
                  placeholder={t.entry.namePlaceholder}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <TabsContent value="create" className="mt-0 space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="custom-code">{t.entry.customCodeLabel}</Label>
                  <Input
                    id="custom-code"
                    value={customCode}
                    maxLength={8}
                    placeholder={t.entry.customCodePlaceholder}
                    className="text-center font-mono text-lg tracking-[0.3em] uppercase placeholder:text-xs placeholder:tracking-normal placeholder:normal-case placeholder:font-sans"
                    onChange={(e) => setCustomCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""))}
                  />
                  <p className="text-xs text-muted-foreground">{t.entry.customCodeHint}</p>
                </div>
                <Button
                  className="w-full"
                  size="lg"
                  disabled={
                    !name.trim() ||
                    busy ||
                    (customCode.length > 0 && (customCode.length < 5 || customCode.length > 8))
                  }
                  onClick={handleCreate}
                >
                  {t.entry.createButton}
                </Button>
              </TabsContent>

              <TabsContent value="join" className="mt-0 space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="code">{t.entry.codeLabel}</Label>
                  <Input
                    id="code"
                    value={code}
                    maxLength={8}
                    placeholder={t.entry.codePlaceholder}
                    className="text-center font-mono text-lg tracking-[0.3em] uppercase"
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                  />
                </div>
                <Button
                  className="w-full"
                  size="lg"
                  disabled={!name.trim() || code.trim().length < 4 || busy}
                  onClick={handleJoin}
                >
                  {t.entry.joinButton}
                </Button>
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>

      <p className="mt-6 max-w-xs text-center text-xs text-muted-foreground">{t.entry.footerNote}</p>
    </div>
  );
}
