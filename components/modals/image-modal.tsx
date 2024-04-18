"use client";

import { useImage } from "@/hooks/use-image";
import { Dialog, DialogContent, DialogHeader } from "../ui/dialog";

export const ImageModal = () => {
    const coverImage = useImage();
    return( 
        <Dialog open={coverImage.isOpen} onOpenChange={coverImage.onClose}>
            <DialogContent>
                <DialogHeader>
                    <h2 className="text-center text-lg font-semibold">
                        Cover Image
                    </h2>
                </DialogHeader>
                <div>
                    TODO: Upload Message
                </div>
            </DialogContent>
        </Dialog>
    );
};
