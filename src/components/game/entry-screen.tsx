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
import { loadLastAvatar, loadLastName } from "@/lib/session";
import { LanguageSwitcher } from "@/components/game/language-switcher";
import { HelpDialog } from "@/components/game/help-dialog";
import { AvatarPicker } from "@/components/game/avatar-picker";
import { ThemeToggle } from "@/components/game/theme-toggle";
import { ROLE_ORDER } from "@/lib/game/roles";
import { roleImageSrc } from "@/lib/game/role-style";

export function EntryScreen() {
  const { createRoom, joinRoom } = useGame();
  const { t } = useLocale();
  const searchParams = useSearchParams();
  const prefillCode = (searchParams.get("code") ?? "").toUpperCase().slice(0, 8);

  const [name, setName] = useState(() => loadLastName());
  const [avatarUrl, setAvatarUrl] = useState<string | null>(() => loadLastAvatar());
  const [code, setCode] = useState(prefillCode);
  const [customCode, setCustomCode] = useState("");
  const [tab, setTab] = useState(prefillCode ? "join" : "create");
  const [busy, setBusy] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) return;
    setBusy(true);
    await createRoom(name.trim(), customCode.trim() || undefined, avatarUrl);
    setBusy(false);
  };

  const handleJoin = async () => {
    if (!name.trim() || code.trim().length < 4) return;
    setBusy(true);
    await joinRoom(code.trim().toUpperCase(), name.trim(), avatarUrl);
    setBusy(false);
  };

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-10 safe-top safe-bottom">
      <div className="mb-2 flex w-full max-w-sm items-center justify-between">
        <HelpDialog trigger={<Button variant="ghost" size="sm">{t.entry.helpButton}</Button>} />
        <div className="flex items-center gap-1.5">
          <ThemeToggle />
          <LanguageSwitcher />
        </div>
      </div>

      <div className="mb-8 flex animate-in fade-in-0 flex-col items-center gap-3 text-center duration-500">
        <div className="flex size-16 animate-float-slow items-center justify-center rounded-2xl bg-primary/15 text-primary ring-1 ring-primary/30">
          <Moon className="size-8" />
        </div>
        <h1 className="font-heading text-3xl font-bold tracking-tight">{t.entry.title}</h1>
        <p className="max-w-xs text-sm text-muted-foreground">{t.entry.subtitle}</p>
      </div>

      <div className="mb-8 w-full max-w-md animate-in fade-in-0 duration-700">
        <p className="mb-2 text-center text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
          {t.entry.castLabel}
        </p>
        {/* overflow-x-auto だけでも指でのスクロールは本来動くはずだが、以下の2点を明示的に
            潰しておく:
            (1) 画像は非同期に読み込まれ、サイズを固定していないと読み込み完了のたびに
                各アイテムの幅が変わってレイアウトが揺れ、ブラウザの scroll anchoring が
                scrollLeft を勝手に補正してしまう(「勝手にスクロールされる」の主因)。
                → 各アイテムを固定サイズの箱にして揺れをなくし、念のため
                  overflowAnchor: "none" でも明示的に無効化する。
            (2) <img> は既定で draggable なので、指(またはマウス)でドラッグすると
                ブラウザがスクロールではなく「画像そのもののドラッグ」として処理してしまう
                ことがある。→ draggable=false と select-none で防止し、touch-pan-x で
                横スクロール用のジェスチャーであることを明示する。 */}
        <div
          className="flex touch-pan-x gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{ overflowAnchor: "none" }}
        >
          {ROLE_ORDER.map((role) => (
            <div key={role} className="flex w-16 shrink-0 flex-col items-center gap-1">
              <div className="flex h-20 w-16 items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={roleImageSrc(role)}
                  alt=""
                  draggable={false}
                  className="h-20 w-16 select-none object-contain object-top drop-shadow-md"
                />
              </div>
              <span className="max-w-16 truncate text-center text-[10px] leading-tight text-muted-foreground">
                {t.roles[role].name}
              </span>
            </div>
          ))}
        </div>
      </div>

      <Card className="w-full max-w-sm animate-in fade-in-0 zoom-in-95 border-border/70 bg-card/80 backdrop-blur duration-500">
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
                <Label>{t.entry.avatarLabel}</Label>
                <AvatarPicker value={avatarUrl} onChange={setAvatarUrl} name={name} />
              </div>
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
