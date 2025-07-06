import { useDebouncedOnUpdate } from "../../utils/debounce";
import { EntryObj } from "../../types/Journal";
import { EditorContent, useEditor } from "@tiptap/react";
import { useEffect } from "react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from '@tiptap/extension-placeholder'
import { JOURNAL_TITLE_PLACEHOLDER } from "../../../../constants";

export function Title({ currEntry, updateTitle }: { currEntry: EntryObj, updateTitle: CallableFunction }) {
  // see Editor for notes
  const onUpdate = useDebouncedOnUpdate(({ editor }) => {
    updateTitle({ title: editor.getText()  });
  }, 500);

  const title = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: JOURNAL_TITLE_PLACEHOLDER
      }),
    ],
    editorProps: {
      attributes: {
        class: 'text-xl'
      },
    },
    content: currEntry.title,
    onUpdate: onUpdate,
    shouldRerenderOnTransaction: false,
  })

  if (!title) {
    return null
  }

  useEffect(() => {
    if (title.getText() === currEntry.title) {
      return 
    }
    title.commands.setContent(currEntry.title, false,  { preserveWhitespace: true })
  }, [currEntry])

  return <EditorContent editor={title}/>
}


