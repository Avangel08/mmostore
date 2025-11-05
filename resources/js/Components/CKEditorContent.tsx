import "ckeditor5/ckeditor5.css";

interface CKEditorContentProps extends React.HTMLAttributes<HTMLDivElement> {
    htmlContent: string;
}

export const CKEditorContent = ({ htmlContent, ...props }: CKEditorContentProps) => {
    return (
        <div
            className="ck-content"
            {...props}
            dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
    );
};