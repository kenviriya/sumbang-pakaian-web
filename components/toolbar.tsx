"use client";

import { Doc } from "@/convex/_generated/dataModel";
import { IconPicker } from "./icon-picker";
import { Button } from "@/components/ui/button";
import { ImageIcon, Smile, X } from "lucide-react";
import { ElementRef, useRef, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import TextareaAutosize from "react-textarea-autosize";
import { useImage } from "@/hooks/use-image";

interface ToolbarProps{
    preview?: boolean; 
};

export const Toolbar = ({
    preview
}: ToolbarProps) => {
const Image = useImage();


    return (
        <div className="pl-[54px] group relative">
            <div className="opacity-0 group-hover:opacity-100 flex items-center gap-x-1 py-4">
                
                    <Button onClick={Image.onOpen} className="text-muted-foreground text-xs" variant="outline" size="sm">
                        <ImageIcon className="h-4 w-4 mr-2"/>
                        Add Image
                    </Button>
            </div>
            
        </div>

    )
}

