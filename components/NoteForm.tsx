import { FormEvent, FC} from 'react'
import { supabase } from '../utils/supabase'
import useStore from '../store'
import { useMutateNote } from '../hooks/useMutateNote'
import { Spinner } from './Spinner'

export const NoteForm: FC = () => {
    const { editedNote } = useStore()
    const update = useStore((state) => state.updateEditedNote)
    const { createNoteMutation, updateNoteMutation } = useMutateNote()


    const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const user = supabase.auth.session()?.user
        if (!user?.id) {
            alert("ログインユーザーが取得できません。ログインしてください。")
            return
        }
        if (editedNote.id === "") {
            createNoteMutation.mutate({
                //id: editedNote.id , // Provide a default empty string for id
                title: editedNote.title,
                content: editedNote.content,

            })
        } else {
            updateNoteMutation.mutate({
                id: editedNote.id,
                title: editedNote.title,
                content: editedNote.content,
            })
        }
    }
    if ( updateNoteMutation.status === 'pending'
        ||
        createNoteMutation.status === 'pending' )
        { return <Spinner /> }

    return (
        <form onSubmit={submitHandler}>
            <div>
            <input
            type="text"
            className='border border-gray-300 rounded px-3 py-2 my-2 focus:outline-none  focus:border-indigo-500'
            placeholder="Title"
            value={editedNote.title}
            onChange={(e) => update({ ...editedNote, title: e.target.value })}
            />
            </div>
            <div>
            <textarea
            cols={50}
            rows={10}
            className='border border-gray-300 rounded px-3 py-2 my-2 focus:outline-none  focus:border-indigo-500'
            placeholder="Content"
            value={editedNote.content}
            onChange={(e) => update({ ...editedNote, content: e.target.value })}
            />
            </div>
            <div>
            <button type="submit"
            className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50'
            >
            {editedNote.id === "" ? "Create Note" : "Update Note"}
            </button>
            </div>
        </form>
    )
}
