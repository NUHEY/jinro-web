"use client";

import { BookOpen } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { useLocale } from "@/lib/i18n/locale-context";
import { ROLE_ORDER, ROLES } from "@/lib/game/roles";
import { ICONS, styleOf } from "@/lib/game/role-style";
import { cn } from "@/lib/utils";

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
      <DialogContent className="max-h-[85vh] max-w-md overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl">{t.help.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-5 py-1 text-sm">
          <p className="leading-relaxed text-muted-foreground">{t.help.intro}</p>

          <div className="space-y-2">
            <p className="text-xs font-bold text-muted-foreground">{t.help.flowTitle}</p>
            <ol className="space-y-1.5">
              {t.help.flowSteps.map((step, i) => (
                <li key={i} className="leading-relaxed">
                  {step}
                </li>
              ))}
            </ol>
          </div>

          <div className="space-y-1.5">
            <p className="text-xs font-bold text-muted-foreground">{t.help.winTitle}</p>
            <ul className="space-y-1 leading-relaxed">
              <li>{t.help.winVillage}</li>
              <li>{t.help.winWerewolf}</li>
              <li>{t.help.winFox}</li>
              <li>{t.help.winGod}</li>
              <li>{t.help.winLover}</li>
            </ul>
          </div>

          <div className="space-y-1.5">
            <p className="text-xs font-bold text-muted-foreground">{t.help.rolesTitle}</p>
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
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button className="w-full">{t.help.close}</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
