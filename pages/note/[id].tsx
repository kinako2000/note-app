import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { supabase } from '../../utils/supabase';
import Layout from '../../components/Layout';
import { CommentForm } from '../../components/CommentForm';
import { CommentItem } from '../../components/CommentItem';
import { Note } from '../../types/types';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { ChevronDoubleLeftIcon } from '@heroicons/react/24/solid';

// ------- 型定義 -------
type StaticProps = {
    note: Note | null;
};

// ------- ISRの静的パス生成 -------
const getAllNoteIds = async () => {
    const { data: ids, error } = await supabase.from('notes').select('id');
    if (error) throw new Error(error.message);

    return ids!.map((id) => ({
    params: { id: String(id.id) },
    }));
};

export const getStaticPaths: GetStaticPaths = async () => {
    const paths = await getAllNoteIds();
    return {
    paths,
    fallback: 'blocking', // ISR 有効
    };
};

// ------- ISRのデータ取得 -------
export const getStaticProps: GetStaticProps = async (context) => {
    const { data: note, error } = await supabase
    .from('notes')
    .select('*, comments(*)')
    .eq('id', context.params?.id)
    .single();

    if (error || !note) {
    return {
      props: { note: null }, // null 許容で安全に処理
        revalidate: 1,
    };
    }

    return {
    props: {
        note: { ...note, comments: note.comments ?? [] },
    },
    revalidate: 1,
    };
};

// ------- Supabaseデータ取得関数 -------
const fetchNote = async (id: string): Promise<Note> => {
    const { data, error } = await supabase
    .from('notes')
    .select('*, comments(*)')
    .eq('id', id)
    .single();

    if (error || !data) throw new Error('Note not found');
    return { ...data, comments: data.comments ?? [] };
};

// ------- メインページ -------
const NotePage: NextPage<StaticProps> = ({ note: staticNote }) => {
    const router = useRouter();
    const id = router.query.id as string;

    const {
    data: note,
    isLoading,
    isError,
    } = useQuery<Note>({
    queryKey: ['note', id],
    queryFn: () => fetchNote(id),
    placeholderData: staticNote ?? undefined,
    enabled: !!id,
    staleTime: 0,
    });

    if (router.isFallback || isLoading || !note) {
    return (
        <Layout title="Loading...">
        <p>読み込み中...</p>
        </Layout>
    );
    }

    if (isError || !note) {
    return (
        <Layout title="Error">
        <p className="text-red-500">ノートが見つかりませんでした。</p>
        <Link href="/notes"  prefetch={false}>
            <div className="text-blue-500 underline">← 一覧ページに戻る</div>
        </Link>
        </Layout>
    );
    }

    return (
    <Layout title="NoteDetail">
        <p className="text-3xl font-semibold text-blue-500">{note.title}</p>
        <div className="m-8 rounded-lg p-4 shadow-lg">
        <p>{note.content}</p>
        </div>
        <ul className="my-2 cursor-pointer text-pink-500">
        {Array.isArray(note.comments) &&
            note.comments.map((comment) => (
            <CommentItem
                key={comment.id}
                id={comment.id}
                content={comment.content}
                user_id={comment.user_id}
                note_id={comment.note_id}
            />
            ))}
        </ul>
        <CommentForm noteId={note.id} />
        <Link href="/notes"  prefetch={false}>
            <ChevronDoubleLeftIcon className="my-6 h-4 w-6 cursor-pointer text-blue-500" />
        </Link>
    </Layout>
    );
};

export default NotePage;





/*
const getAllNoteIds = async () => {
    const {data: ids, error} = await supabase
        .from('notes')
        .select('id');
        if (error) {
            throw new Error(error.message);
        }
    return ids!.map((id) => {
        return {
            params: { id: String(id.id) }
        }
    })
}

export const getStaticPaths: GetStaticPaths = async () => {
    const paths = await getAllNoteIds()
    return {
        paths,
        fallback: 'blocking'
    }
}
export const getStaticProps: GetStaticProps = async (context) => {
    console.log('ISR invoked - detail page')
    const { data: note, error} = await supabase
        .from('notes')
        .select('*, comments(*)')
        .eq('id', context.params?.id)
        .single()

        if (error || !note) {
            return {
                props: {
                note: null
                },
                revalidate: 1,
            }
            }
        if (!note) {
        return <Layout title="Loading..."><p>Loading...</p></Layout>
            }

    return {
        props: {
            note:{  ...note, comments: note.comments ?? [],}
        },
        revalidate: 1
    }
}

type StaticProps = {
    note: Note
}

const NotePage: NextPage<StaticProps> = ( {note} ) => {
    return (
    <Layout title="NoteDetail">
        <p className="text-3xl font-semibold text-blue-500 ">{note.title}</p>
        <div className="m-8 rounded-lg p-4 shadow-lg">
            <p>{note.content}</p>
        </div>
        <ul className="my-2 cursor-pointer text-pink-500">
        {note.comments?.map((comment) => (
            <CommentItem
            key={comment.id}
            id={comment.id}
            content={comment.content}
            user_id={comment.user_id}
            note_id={comment.note_id}
            />
            ))}
        </ul>
        <CommentForm noteId={note.id} />
        <Link href="/notes" passHref prefetch={false}>
        <ChevronDoubleLeftIcon className= "my-6 h-4 w-6 cursor-pointer text-blue-500"/>
        </Link>
    </Layout>
    )
}

export default NotePage*/

/*import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { supabase } from '../../utils/supabase';
import Layout from '../../components/Layout';
import { CommentForm } from '../../components/CommentForm';
import { CommentItem } from '../../components/CommentItem';
import { Note } from '../../types/types';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { ChevronDoubleLeftIcon } from '@heroicons/react/24/solid';

// ---------- getStaticPaths ----------
const getAllNoteIds = async () => {
    const { data: ids, error } = await supabase
    .from('notes')
    .select('id');

    if (error) {
    throw new Error(error.message);
    }

    return ids!.map((id) => ({
    params: { id: String(id.id) },
    }));
};

export const getStaticPaths: GetStaticPaths = async () => {
    const paths = await getAllNoteIds();
    return {
    paths,
    fallback: 'blocking', // ISRを有効化
    };
};

// ---------- getStaticProps ----------
export const getStaticProps: GetStaticProps = async (context) => {
    console.log('ISR invoked - detail page');
    const { data: note, error } = await supabase
    .from('notes')
    .select('*, comments(*)')
    .eq('id', context.params?.id)
    .single();

    if (error || !note) {
    return {
        props: { note: null },
        revalidate: 1,
    };
    }

    return {
    props: {
        note: { ...note, comments: note.comments ?? [] },
    },
    revalidate: 1,
    };
};

// ---------- フェッチ関数 ----------
const fetchNote = async (id: string): Promise<Note> => {
    const { data, error } = await supabase
    .from('notes')
    .select('*, comments(*)')
    .eq('id', id)
    .single();

    if (error || !data) throw new Error('Note not found');
    return { ...data, comments: data.comments ?? [] };
};

// ---------- ページコンポーネント ----------
type StaticProps = {
    note: Note | null;
};

const NotePage: NextPage<StaticProps> = ({ note: staticNote }) => {
    const router = useRouter();
    const id = router.query.id as string;

    const { data: note, isLoading, isError } = useQuery<Note>({
    queryKey: ['note', id],
    queryFn: () => fetchNote(id),
    initialData: staticNote ?? undefined,
    enabled: !!id,
    staleTime: 0,
    });

    if (isLoading) {
    return <Layout title="Loading..."><p>読み込み中...</p></Layout>;
    }

    if (isError || !note) {
    return <Layout title="Error"><p>ノートが見つかりませんでした。</p></Layout>;
    }

    return (
    <Layout title="NoteDetail">
        <p className="text-3xl font-semibold text-blue-500">{note.title}</p>
        <div className="m-8 rounded-lg p-4 shadow-lg">
        <p>{note.content}</p>
        </div>
        <ul className="my-2 cursor-pointer text-pink-500">
        {Array.isArray(note.comments) && note.comments?.map((comment) => (
            <CommentItem
            key={comment.id}
            id={comment.id}
            content={comment.content}
            user_id={comment.user_id}
            note_id={comment.note_id}
            />
        ))}
        </ul>
        <CommentForm noteId={note.id} />
        <Link href="/notes" passHref prefetch={false}>
        <ChevronDoubleLeftIcon className="my-6 h-4 w-6 cursor-pointer text-blue-500" />
        </Link>
    </Layout>
    );
};

export default NotePage;
*/