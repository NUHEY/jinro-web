"use client";

import { ROLES, type RoleId } from "@/lib/game/roles";
import { ICONS, styleOf, roleImageSrc } from "@/lib/game/role-style";
import { cn } from "@/lib/utils";

// 役職を表す丸いアバター。キャラクターの立ち絵を丸く切り抜いた上に、これまで使って
// いた役職アイコンを右下に小さなバッジとして重ねて表示する(縁取り付き)。
// サイトのあちこちにある「役職チップ」(役職構成の編集・一覧・結果画面など)を
// すべてこれに揃えることで、キャラクター画像をサイト全体で活かす。
export function RoleAvatar({
  role,
  size = 36,
  className,
}: {
  role: RoleId;
  size?: number;
  className?: string;
}) {
  const def = ROLES[role];
  const Icon = ICONS[def.icon] ?? ICONS.User;
  const style = styleOf(def.color);
  const badgeSize = Math.max(14, Math.round(size * 0.46));
  const iconSize = Math.max(8, Math.round(badgeSize * 0.56));

  return (
    <div className={cn("relative shrink-0", className)} style={{ width: size, height: size }}>
      <div className={cn("h-full w-full overflow-hidden rounded-full border", style.chip)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={roleImageSrc(role)} alt="" className="h-full w-full scale-150 object-cover object-top" />
      </div>
      <div
        className={cn(
          "absolute flex items-center justify-center rounded-full border-2 border-background",
          style.chip
        )}
        style={{
          width: badgeSize,
          height: badgeSize,
          right: -badgeSize * 0.12,
          bottom: -badgeSize * 0.12,
        }}
      >
        <Icon style={{ width: iconSize, height: iconSize }} />
      </div>
    </div>
  );
}
