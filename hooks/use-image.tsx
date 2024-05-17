// import { create } from "zustand";

// type ImageStore = {
//     url?: string;
//     isOpen: boolean;
//     onOpen: () => void;
//     onClose: () => void;
//     onReplace: (url: string) => void;
// };

// export const useImage = create<ImageStore>((set) => ({
//     url: undefined,
//     isOpen: false,
//     onOpen: () => set({isOpen: true , url: undefined}),
//     onClose: () => set({isOpen: false, url: undefined}),
//     onReplace: (url:string) => set({isOpen: true, url})
// }));
