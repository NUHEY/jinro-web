"use client";

import { BookOpen, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useLocale } from "@/lib/i18n/locale-context";
import { ROLE_ORDER, ROLES, type Team } from "@/lib/game/roles";
import { ICONS, styleOf } from "@/lib/game/role-style";
import { cn } from "@/lib/utils";

const WIN_TEAM_ORDER: Array<{ key: "winVillage" | "winWerewolf" | "winFox" | "winGod" | "winLover"; team: Team }> = [
  { key: "winVillage", team: "village" },
  { key: "winWerewolf", team: "werewolf" },
  { key: "winFox", team: "fox" },
  { key: "winGod", team: "god" },
  { key: "winLover", team: "lover" },
];

export function HelpDialog({
  trigger,
}: {
  trigger?: React.ReactNode;
}) {
  const { t } = useLocale();
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="outline" size="sm">
            <BookOpen className="size-3.5" /> {t.help.button}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="flex max-h-[85vh] max-w-md flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl">{t.help.title}</DialogTitle>
        </DialogHeader>

        <p className="rounded-lg border border-primary/40 bg-primary/15 px-3 py-2 text-sm font-medium leading-relaxed text-foreground">
          {t.help.tldr}
        </p>

        <Tabs defaultValue="flow" className="flex min-h-0 flex-1 flex-col">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="flow">{t.help.tabFlow}</TabsTrigger>
            <TabsTrigger value="win">{t.help.tabWin}</TabsTrigger>
            <TabsTrigger value="roles">{t.help.tabRoles}</TabsTrigger>
          </TabsList>

          <div className="mt-3 min-h-0 flex-1 overflow-y-auto pr-1">
            <TabsContent value="flow" className="mt-0 space-y-3">
              <p className="text-sm leading-relaxed text-muted-foreground">{t.help.intro}</p>
              <div className="space-y-2">
                {t.help.flowSteps.map((step, i) => (
                  <div key={i} className="flex gap-3 rounded-lg border border-border/60 bg-card/60 px-3 py-2.5">
                    <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
                      {i + 1}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold">{step.title}</p>
                      <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="win" className="mt-0 space-y-3">
              <p className="text-sm leading-relaxed text-muted-foreground">{t.help.winIntro}</p>
              <div className="space-y-2">
                {WIN_TEAM_ORDER.map(({ key, team }) => {
                  const style = styleOf(
                    team === "village" ? "sky" : team === "werewolf" ? "red" : team === "fox" ? "orange" : team === "god" ? "yellow" : "pink"
                  );
                  return (
                    <div key={key} className="flex items-start gap-3 rounded-lg border border-border/60 bg-card/60 px-3 py-2.5">
                      <Trophy className={cn("mt-0.5 size-4 shrink-0", style.text)} />
                      <p className="text-sm leading-relaxed">{t.help[key]}</p>
                    </div>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="roles" className="mt-0 space-y-3">
              <p className="text-xs text-muted-foreground">{t.help.rolesIntro}</p>
              <div className="space-y-1.5">
                {ROLE_ORDER.map((roleId) => {
                  const def = ROLES[roleId];
                  const text = t.roles[roleId];
                  const style = styleOf(def.color);
                  const Icon = ICONS[def.icon] ?? ICONS.User;
                  return (
                    <div
                      key={roleId}
                      className="flex items-start gap-3 rounded-lg border border-border/60 bg-card/60 px-3 py-2"
                    >
                      <div className={cn("mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full border", style.chip)}>
                        <Icon className="size-3.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold">{text.name}</p>
                        <p className="text-[11px] text-muted-foreground">{text.short}</p>
                      </div>
                      <Badge variant="outline" className={cn("mt-0.5 shrink-0 text-[10px]", style.text)}>
                        {t.team[def.team]}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </TabsContent>
          </div>
        </Tabs>

        <DialogFooter>
          <DialogClose asChild>
            <Button className="w-full">{t.help.close}</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
