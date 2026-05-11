"use client"
import React, { useEffect, useState } from "react"

import { useParams, useRouter } from "next/navigation";

import { getLocalizedUrl } from "@/shared/utils/i18n";
import type { Locale } from "@/config/i18n";

const AppLayout = () => {
    // const userData = sessionStorage.getItem('user');
    const [value, setValue] = useState('');
    const router = useRouter()
    const locale = 'en'

    useEffect(() => {
        const storedValue = sessionStorage.getItem('user');

        console.log('storedValue:', storedValue);

        const redirectURL = storedValue ? '/apps/candidate/list' : '/login'

        router.replace(getLocalizedUrl(redirectURL, locale as Locale))

    }, []);

    return (
        <div>
            {/* Hello World {value} */}
        </div>
    )
}

export default AppLayout
