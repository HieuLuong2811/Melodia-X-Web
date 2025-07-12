'use client';

import React from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

interface MyCKEditorProps {
  value: string;
  onChange: (data: string) => void;
}

const MyCKEditor = ({ value, onChange }: MyCKEditorProps) => {
  return (
     <div className="ckeditor-wrapper">
      <CKEditor
        editor={ClassicEditor}
        data={value}
        onReady={(editor) => {
          const editableElement = editor.ui.getEditableElement();
          if (editableElement) {
            editableElement.style.minHeight = '300px';
            editableElement.style.cursor = 'pointer';
            editableElement.style.color = '#000'; 
          }
        }}
        onChange={(event, editor) => {
          const data = editor.getData();
          onChange(data);
        }}
      />
    </div>
  );
};

export default MyCKEditor;
