'use client';
import { startTransition } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { useIsBlocked } from "@/components/Blocker";
import check from "@/components/Check";

/**
 * A custom Link component that wraps Next.js's next/link component.
 */
export function CustomLink({
                         href,
                         children,
                         replace,
                        setAction,
                         ...rest
                     }: Parameters<typeof NextLink>[0] & { setAction: (save: boolean) => void; }) {
    const router = useRouter();
    const isBlocked = useIsBlocked();

    const startTransition = (href: any) => {
        const url = href.toString();
        if (replace) {
            router.replace(url);
        } else {
            router.push(url);
        }
    };

    return (
        <NextLink
            href={href}
            onClick={(e) => {
                // if(check()){
                    e.preventDefault();

                    if (isBlocked && window.confirm('Bạn Có Muốn Lưu Bài Viết Này Lại Không?')) {
                        setAction(false);
                        return;
                    }

                    startTransition(href);

                // }
                }
            }
            {...rest}
        >
            {children}
        </NextLink>
    );
}