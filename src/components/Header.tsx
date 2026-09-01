import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { Leaf, Zap, FlaskConical, ShoppingCart, Home } from 'lucide-react';

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <RouterLink to="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl text-[#002D62]">Mahidol Portal</span>
          </RouterLink>

          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <RouterLink to="/" className={navigationMenuTriggerStyle()}>
                  <Home className="w-4 h-4 mr-2" />
                  หน้าหลัก
                </RouterLink>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-[#002D62]">
                  ระบบศูนย์ย่อย (Sub-Systems)
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    <li>
                      <NavigationMenuLink asChild>
                        <a
                          href="/smart-farm"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-green-50 hover:text-green-700"
                        >
                          <div className="flex items-center text-sm font-medium leading-none mb-2">
                            <Leaf className="w-4 h-4 mr-2 text-green-600" />
                            ระบบ Smart Farm IoT
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            ระบบติดตามและจัดการฟาร์มอัจฉริยะแบบเรียลไทม์
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <a
                          href="/clean-energy"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-blue-50 hover:text-blue-700"
                        >
                          <div className="flex items-center text-sm font-medium leading-none mb-2">
                            <Zap className="w-4 h-4 mr-2 text-blue-600" />
                            ศูนย์พลังงานสะอาด
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            ระบบมอนิเตอร์พลังงานแสงอาทิตย์และพลังงานทดแทน
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <a
                          href="/rac"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-orange-50 hover:text-orange-700"
                        >
                          <div className="flex items-center text-sm font-medium leading-none mb-2">
                            <FlaskConical className="w-4 h-4 mr-2 text-orange-600" />
                            ศูนย์วิจัย RAC
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            ระบบฐานข้อมูลงานวิจัยและทดลอง Research & Academic Center
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <a
                          href="/#storefront"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-[#F2A900]/20 hover:text-[#002D62]"
                        >
                          <div className="flex items-center text-sm font-medium leading-none mb-2">
                            <ShoppingCart className="w-4 h-4 mr-2 text-[#F2A900]" />
                            ร้านค้าผลผลิตเกษตร
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            ระบบสั่งซื้อผลผลิต งานวิจัยและผลิตภัณฑ์จากศูนย์ฯ
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
    </header>
  );
};
