import { FC, useEffect, useState } from "react";
import {  TrashIcon, PencilIcon } from "@heroicons/react/24/solid"
import { supabase } from "../utils/supabase";
import useStore from "../store";
import { useMutateComment } from "../hooks/useMutateComment";
import { Comment } from "../types/types";
import { Spinner } from "./Spinner";

export const CommentItem:FC<Omit<Comment,'created_at' >> = ({
    id,
    content,
    user_id,
    note_id
}) => {
    const userId = useStore((state) => state.userId);
    const update = useStore((state) => state.updateEditedComment);
    const { deleteCommentMutation } = useMutateComment();


    if (userId === null) return null;

    if (deleteCommentMutation.isPending) {
        return <Spinner />
        }
    return (
    <li className="my-3">
        <span>{content}</span>
        {userId === user_id && (
        <div className="float-right ml-20 flex">
            <PencilIcon
            className="mx-1 h-5 w-5 text-blue-500 cursor-pointer"
            onClick={() => update({ id,content, user_id, note_id })}
            />
            <TrashIcon
            className="h-5 w-5 text-blue-500 cursor-pointer"
            onClick={() => deleteCommentMutation.mutate(id)}
            />
        </div>
        )}
    </li>
    )
}

