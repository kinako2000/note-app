/*import { NextPage } from 'next';
import { DocumentTextIcon, ArrowRightIcon} from '@heroicons/react/24/solid';
import Layout from '../components/Layout';
import { supabase } from '../utils/supabase';
import { GetStaticProps } from 'next';
import { NoteForm } from '../components/NoteForm';
import { NoteItem } from '../components/NoteItem';
import { Note } from '../types/types';

export const getStaticProps: GetStaticProps = async () => {
    console.log('ISR invoked - notes page');
    const { data:notes, error } = await supabase
        .from('notes')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        throw new Error(` ${error.message}: ${error.details}`);
    }
    console.log("取得したnotes", notes)
    return {
        props: { notes },
        revalidate: 1, // Revalidate every 10 seconds

    };

};

type StaticProps = {
    notes: Note[]
}
const Notes:NextPage<StaticProps> = ({ notes }) => {
    const signOut = () => { supabase.auth.signOut() }
    return  <Layout title="Notes">
                <ArrowRightIcon className="mb-6 h-6 w-6 text-blue-500 cursor-pointer"
                            onClick={signOut}
                />
                <DocumentTextIcon className="h-8 w-8 text-blue-500" />
                    <ul className='my-2 cursor-pointer pink-500'>
                    {notes.map((note) => (
                        <NoteItem
                                key={note.id}
                                id={note.id}
                                title={note.title}
                                content={note.content}
                                user_id={note.user_id}
                            />
                                ))}
                    </ul>
                    <NoteForm />
            </Layout>
}

export default Notes */

import { NextPage, GetStaticProps } from 'next';
import { DocumentTextIcon, ArrowRightIcon } from '@heroicons/react/24/solid';
import Layout from '../components/Layout';
import { supabase } from '../utils/supabase';
import { NoteForm } from '../components/NoteForm';
import { NoteItem } from '../components/NoteItem';
import { Note } from '../types/types';
import { useQuery } from '@tanstack/react-query';

type StaticProps = {
    notes: Note[];
};

export const getStaticProps: GetStaticProps = async () => {
    console.log('ISR invoked - notes page');
    const { data: notes, error } = await supabase
    .from('notes')
    .select('*')
    .order('created_at', { ascending: false });

    if (error) {
    throw new Error(`${error.message}: ${error.details}`);
    }

    return {
    props: { notes: notes ?? [] },
    revalidate: 10,
    };
};

const fetchNotes = async (): Promise<Note[]> => {
    const { data, error } = await supabase
    .from('notes')
    .select('*')
    .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data ?? [];
};

const Notes: NextPage<StaticProps> = ({ notes: staticNotes }) => {
    const signOut = () => {
    supabase.auth.signOut();
    };

    const { data: notes } = useQuery<Note[]>({
    queryKey: ['notes'],
    queryFn: fetchNotes,
    initialData: staticNotes,
    staleTime: 1000,
    });

    return (
    <Layout title="Notes">
        <ArrowRightIcon
        className="mb-6 h-6 w-6 text-blue-500 cursor-pointer"
        onClick={signOut}
        />
        <DocumentTextIcon className="h-8 w-8 text-blue-500" />
        <ul className="my-2 cursor-pointer">
        {notes?.map((note) => (
            <NoteItem
            key={note.id}
            id={note.id}
            title={note.title}
            content={note.content}
            user_id={note.user_id}
            />
        ))}
        </ul>
        <NoteForm />
    </Layout>
    );
};

export default Notes;
