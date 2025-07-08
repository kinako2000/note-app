import create from "zustand";
import { EditedNote, EditedComment } from "./types/types";

type State = {
    editedNote: EditedNote;
    editedComment: EditedComment;
    updateEditedNote: (payload: EditedNote) => void;
    updateEditedComment: (payload: EditedComment) => void;
    resetEditedNote: () => void;
    resetEditedComment: () => void;
    userId: string | null;
    setUserId: (id: string | null) => void;
}

const useStore = create<State>((set) => ({
    editedNote: { id:"", title:"", content:""},
    editedComment: {id: "", content:"", note_id:"", user_id:""},
    updateEditedNote: (payload: EditedNote) => set(() => ({ editedNote:{id: payload.id, title: payload.title, content: payload.content} })),
    updateEditedComment: (payload: EditedComment) => set(() => ({ editedComment: {id: payload.id, content: payload.content, note_id: payload.note_id, user_id: payload.user_id} })),
    resetEditedNote: () => set(() => ({ editedNote: { id:"", title:"", content:""} })),
    resetEditedComment: () => set(() => ({ editedComment: { id:"" , content:"" , note_id:"", user_id:"" }})),
    userId: null,
    setUserId: (id) => set({ userId: id }),
}));

export default useStore;