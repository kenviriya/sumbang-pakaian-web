'use client';

import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Button} from '@/components/ui/button';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';

import {Bell, BellDot} from 'lucide-react';
import {Separator} from '@/components/ui/separator';

const Notification = () => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant={'ghost'} size={'icon'}>
          <Bell className="h-4 w-4" />
          {/* <BellDot className="h-4 w-4" color="red" /> */}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Notifikasi</h4>
            <p className="text-sm text-muted-foreground">
              {/* Kamu punya 1 notifikasi */}
              Kamu belum punya notifikasi
            </p>
          </div>
          <Separator />

          {/* <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="width">Width</Label>
              <Input
                id="width"
                defaultValue="100%"
                className="col-span-2 h-8"
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="maxWidth">Max. width</Label>
              <Input
                id="maxWidth"
                defaultValue="300px"
                className="col-span-2 h-8"
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="height">Height</Label>
              <Input
                id="height"
                defaultValue="25px"
                className="col-span-2 h-8"
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="maxHeight">Max. height</Label>
              <Input
                id="maxHeight"
                defaultValue="none"
                className="col-span-2 h-8"
              />
            </div>
          </div> */}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default Notification;
