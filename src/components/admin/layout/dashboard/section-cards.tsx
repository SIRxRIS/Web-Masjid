import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function SectionCards() {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {/* Total Saldo - keeping existing card */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Saldo</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            Rp10,250.000
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +12.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Peningkatan bulan ini <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Dibandingkan bulan lalu</div>
        </CardFooter>
      </Card>

      {/* Total Donatur */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Donatur</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            156
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +15%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Pertumbuhan donatur <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Donatur aktif bulan ini</div>
        </CardFooter>
      </Card>

      {/* Kegiatan Aktif */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Kegiatan Aktif</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            12
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +2
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Kegiatan bulan ini <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Program masjid aktif</div>
        </CardFooter>
      </Card>

      {/* Pertumbuhan Dana */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Pertumbuhan Dana</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            15.5%
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +2.3%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Peningkatan dana <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Dibanding tahun lalu</div>
        </CardFooter>
      </Card>

      {/* Total Kotak Amal */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Kotak Amal</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            Rp2,150.000
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +8.2%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Minggu ini <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Dari kotak amal Jumat</div>
        </CardFooter>
      </Card>

      {/* Donasi Bulanan */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Donasi Bulanan</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            Rp8,500.000
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +5.7%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Donasi rutin <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Donasi bulan ini</div>
        </CardFooter>
      </Card>

      {/* Pengeluaran Terkini */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Pengeluaran Terkini</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            Rp3,250.000
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingDown />
              -12.3%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Pengeluaran menurun <IconTrendingDown className="size-4" />
          </div>
          <div className="text-muted-foreground">Dibanding bulan lalu</div>
        </CardFooter>
      </Card>

      {/* Total Pengunjung */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Pengunjung</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            25
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +10.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Pengunjung meningkat <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Rata-rata mingguan</div>
        </CardFooter>
      </Card>
    </div>
  );
}