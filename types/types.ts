export type Comment = {
    id: string;
    content: string;
    created_at: string;
    note_id: string;
    user_id: string;
}
export type Note = {
    id: string;
    title: string;
    content: string;
    created_at: string;
    user_id: string | undefined;
    comments: Comment[];
}

export type EditedNote = {
    id: string | undefined;
    title: string;
    content: string;
  };

  export type EditedComment = {
    id: string | undefined;
    content: string;
    note_id: string;
    user_id: string;
  };

