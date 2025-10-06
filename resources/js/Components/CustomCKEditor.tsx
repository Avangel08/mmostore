import React from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import "ckeditor5/ckeditor5.css";
import {
  ClassicEditor,
  Bold,
  Essentials,
  Heading,
  Indent,
  IndentBlock,
  Italic,
  Link,
  List,
  ListProperties,
  MediaEmbed,
  Paragraph,
  Table,
  Undo,
  Image,
  ImageInsert,
  BlockQuote,
  CodeBlock,
  ImageCaption,
  ImageToolbar,
  ImageStyle,
  ImageTextAlternative,
  ImageEditing,
  LinkImage,
  ImageResize,
  AutoImage,
  AutoLink,
  Base64UploadAdapter,
  EditorConfig,
  FontFamily,
  FontSize,
  FontColor,
  FontBackgroundColor,
  Underline,
  Strikethrough,
  Code,
  Subscript,
  Superscript,
  Alignment,
  RemoveFormat,
  TodoList
} from "ckeditor5";

interface CustomCKEditorProps {
  data: string;
  onChange: (data: string) => void;
  [key: string]: any;
}

const CustomCKEditor: React.FC<CustomCKEditorProps> = ({
  data,
  onChange,
  ...props
}) => {
  const editorConfig: EditorConfig = {
    licenseKey: "GPL",
    fontSize: {
      options: [9, 11, 13, "default", 17, 19, 21, 36, 48, 62, 80],
    },
    image: {
      toolbar: [
        "imageTextAlternative",
        "toggleImageCaption",
        "|",
        "imageStyle:inline",
        "imageStyle:block",
        "imageStyle:side",
        "|",
        "resizeImage",
      ],
    },
    toolbar: [
      "undo",
      "redo",
      "|",
      "heading",
      "|",
      "fontSize",
      "fontColor",
      "fontBackgroundColor",
      "|",
      "alignment",
      "|",
      "bold",
      "italic",
      "underline",
      "strikethrough",
      "code",
      "subscript",
      "superscript",
      "|",
      "removeFormat",
      "|",
      "bulletedList",
      "numberedList",
      "todoList",
      "|",
      "indent",
      "outdent",
      "|",
      "insertTable",
      "|",
      "link",
      "insertImageViaUrl",
      "mediaEmbed",
      "|",
      "blockQuote",
      "codeBlock",
    ],
    plugins: [
      Bold,
      Essentials,
      Heading,
      Indent,
      IndentBlock,
      Italic,
      Underline,
      Link,
      List,
      MediaEmbed,
      Paragraph,
      Table,
      Undo,
      Image,
      ImageInsert,
      BlockQuote,
      CodeBlock,
      ImageCaption,
      ImageStyle,
      ImageToolbar,
      ImageStyle,
      ImageTextAlternative,
      ImageEditing,
      ImageResize,
      LinkImage,
      AutoImage,
      AutoLink,
      Base64UploadAdapter,
      FontFamily,
      FontSize,
      FontColor,
      FontBackgroundColor,
      Strikethrough,
      Code,
      Subscript,
      Superscript,
      Alignment,
      RemoveFormat,
      ListProperties,
      TodoList
    ],
    placeholder: props.placeholder || "",
    ...props.config,
  };

  return (
    <CKEditor
      editor={ClassicEditor as any}
      config={editorConfig}
      data={data}
      onChange={(event: any, editor: any) => {
        const editorData = editor.getData();
        onChange(editorData);
      }}
      {...props}
    />
  );
};

export default CustomCKEditor;
