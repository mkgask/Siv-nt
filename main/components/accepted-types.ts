


const accepted_types = {
    'image/png': 'image',
    'image/apng': 'image',
    'image/jpeg': 'image',
    'image/gif': 'image',
    'image/bmp': 'image',
    'image/svg+xml': 'image',
    'image/webp': 'image',
    'image/avif': 'image',
/*
    'video/mp4': 'video',
    'video/webm': 'video',
    'video/ogg': 'video',
    'video/quicktime': 'video',
    'video/x-msvideo': 'video',
    'video/x-ms-wmv': 'video',

    'audio/mp4': 'audio',
    'audio/mpeg': 'audio',
    'audio/ogg': 'audio',
    'audio/wav': 'audio',
    'audio/webm': 'audio',
*/
}



const is_accepted = (mime_type: string): boolean => {
    if (!mime_type) return false
    if (!accepted_types.hasOwnProperty(mime_type)) return false
    return !!accepted_types[mime_type]
}

const get_accepted_types = (): Array<string> => {
    return Object.keys(accepted_types)
}

const get_media_type = (mime_type: string): string => {
    return accepted_types[mime_type]
}



export {
    accepted_types,
    is_accepted,
    get_accepted_types,
    get_media_type,
}


