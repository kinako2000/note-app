import { useEffect,useState, FC } from "react"
import { supabase } from "../utils/supabase"
import Link from "next/link"
import {  TrashIcon, PencilIcon } from "@heroicons/react/24/solid"
import useStore from "../store"
import { Note } from "../types/types"
import  { useMutateNote } from "../hooks/useMutateNote"
import { Spinner } from "./Spinner"


export const NoteItem:FC<Omit<Note,'created_at' | 'note_id' | 'comments'>>
    = ({ id, title, content, user_id}) => {
        const [ userId, setUserId ] = useState<string | undefined>("")
        const update = useStore((state) => state.updateEditedNote)
        const { deleteNoteMutation } = useMutateNote()
        useEffect(() => {
            setUserId(supabase.auth.user()?.id)
        }, [])

        if( deleteNoteMutation.status === 'pending') {
            return <Spinner />
        }
        return (
        <li  className="my-3">
        <Link href={`/note/${id}`}  prefetch={false} >
            <div className="cursor-pointer hover:text=pink=600">{title}</div>
        </Link>
        {userId === user_id && (
            <div className="float-right ml-20 flex">
                <PencilIcon
                className="h-5 w-5 text-blue-500 cursor-pointer"
                onClick={() => update({ id: id, content: content, title: title })}
                />
                <TrashIcon
                className="h-5 w-5 text-blue-500 cursor-pointer"
                onClick={() => deleteNoteMutation.mutate(id)}
                />
            </div>
        )}
    </li>
    )
    }
