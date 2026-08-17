"use client";

import { Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocale } from "@/lib/i18n/locale-context";
import { ROLES, type RoleId } from "@/lib/game/roles";
import { ICONS, styleOf, roleImageSrc } from "@/lib/game/role-style";

// 役職確認画面と「ヘルプ・自分の役職」タブの両方から使う共通カード。
// 自分の役職の説明に加え、役職に応じて見える追加情報(仲間・神様なら全員の役職)も表示する。
export function RoleInfoCard({
  role,
  knownAllies,
  allRolesKnown,
}: {
  role: RoleId;
  knownAllies?: Array<{ id: string; name: string; role: RoleId }>;
  allRolesKnown?: Array<{ id: string; name: string; role: RoleId }>;
}) {
  const { t } = useLocale();
  const def = ROLES[role];
  const text = t.roles[role];
  const style = styleOf(def.color);
  const Icon = ICONS[def.icon] ?? Eye;

  return (
    <Card className={`w-full overflow-hidden border-2 bg-gradient-to-b ${style.panel}`}>
      <CardContent className="flex flex-col items-center gap-3 px-6 py-8 text-center">
        <div className="relative flex h-36 items-center justify-center">
          <div className={`absolute size-28 rounded-full blur-2xl ${style.glow}`} aria-hidden="true" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={roleImageSrc(role)}
            alt={text.name}
            className="relative z-10 h-full w-auto max-w-[190px] object-contain drop-shadow-xl"
          />
          <div
            className={`absolute -right-1 -bottom-1 z-20 flex size-9 items-center justify-center rounded-full border-2 border-background ${style.chip}`}
          >
            <Icon className="size-4" />
          </div>
        </div>
        <div>
          <p className="font-heading text-3xl font-bold">{text.name}</p>
          <Badge variant="outline" className={`mt-1 ${style.text}`}>
            {t.team[def.team]}
          </Badge>
        </div>
        <p className="text-sm leading-relaxed text-foreground/90">{text.detail}</p>

        {knownAllies && knownAllies.length > 0 && (
          <div className="mt-2 w-full rounded-xl border border-border/60 bg-background/40 p-3">
            <p className="mb-1 text-xs font-semibold text-muted-foreground">{t.roleReveal.allies}</p>
            <p className="text-sm font-medium">
              {knownAllies.map((a) => a.name).join(t.common.listSeparator)}
            </p>
          </div>
        )}

        {allRolesKnown && (
          <div className="mt-2 w-full space-y-1 rounded-xl border border-border/60 bg-background/40 p-3 text-left">
            <p className="mb-1 text-xs font-semibold text-muted-foreground">{t.roleReveal.allRoles}</p>
            {allRolesKnown.map((p) => (
              <div key={p.id} className="flex items-center justify-between text-xs">
                <span>{p.name}</span>
                <span className="text-muted-foreground">{t.roles[p.role].name}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
