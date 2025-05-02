import { useState, useEffect, forwardRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { X } from 'lucide-react';

interface InputFileProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  className?: string;
  labelClassName?: string;
}

const InputFile = forwardRef<HTMLInputElement, InputFileProps>(
  ({ className, label, labelClassName, ...props }, ref) => {
    const [fileName, setFileName] = useState<string | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    console.log({ fileName, previewUrl })

    function removeFile() {
      setFileName(null)
      setPreviewUrl(null)
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && event.target.files.length > 0) {
        const file = event.target.files[0];
        setFileName(file.name);

        // Generate a preview URL if the file is an image
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setPreviewUrl(reader.result as string);
          };
          reader.readAsDataURL(file);
        } else {
          setPreviewUrl(null); // Reset preview if not an image
        }
      } else {
        setFileName(null);
        setPreviewUrl(null);
      }
      // Call the original onChange if provided
      props.onChange?.(event);
    };

    // Clean up the preview URL when the component unmounts or the file is changed
    useEffect(() => {
      return () => {
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
        }
      };
    }, [previewUrl]);

    return (
      <div className="space-y-2">
        {label && (
          <Label htmlFor={props.id} className={labelClassName}>
            {label}
          </Label>
        )}
        <div className="relative">
          <Input
            id={props.id}
            type="file"
            className={cn(
              'appearance-none cursor-pointer opacity-0 absolute inset-0 w-full h-full z-10',
              className
            )}
            ref={ref}
            onChange={handleChange}
            {...props}
          />
          <div className="flex items-center border rounded-md px-3 py-2 w-full bg-white dark:bg-gray-800">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5 text-gray-500 mr-2"
            >
              <path
                fillRule="evenodd"
                d="M18.97 3.659a2.25 2.25 0 00-3.182 0l-10.94 10.94a3 3 0 004.243 4.242L15.311 7.88a2.25 2.25 0 003.182 3.182l-1.59 1.59a3 3 0 00-4.242-4.24l10.939-10.94c.9-.9 2.37-.9 3.27 0zm-7.546 7.547a3 3 0 00-4.242-4.24l-4.65 4.65a2.25 2.25 0 003.182 3.182l4.649-4.65z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm text-gray-500 truncate">
              {fileName || 'Choose a file'}
            </span>
          </div>
        </div>
        {previewUrl && (
          <div className="mt-2">
            <div className=' flex justify-end'>
              <Button
                type='button'
                variant={'destructive'}
                onClick={removeFile}
              >
                <X />
              </Button>
            </div>
            <img
              src={previewUrl}
              alt="Preview"
              className="mx-auto max-h-52 max-w-full rounded-md object-cover"
            />
          </div>
        )}
      </div>
    );
  }
);

InputFile.displayName = 'InputFile';

export { InputFile };
