export const getAverageColor = (imgElement:any, ratio:number) => {
    const canvas = document.createElement('canvas');

    let height = canvas.height = imgElement.naturalHeight;
    let width = canvas.width = imgElement.naturalWidth;

    const context = canvas.getContext('2d');
    context?.drawImage(imgElement, 0, 0);

    let data, length;
    let i = -4, count = 0;

    try{
        data = context?.getImageData(0, 0, width, height);
        length = data?.data.length||0;
    }catch(e){
        console.log(e);
        return {
            r: 0,
            g: 0,
            b: 0
        }
    }

    let r, g, b;
    r = g = b = 0;

    while((i+=ratio*4)<length){
        ++count;

        r+=data?.data[i]||0;
        g+=data?.data[i+1]||0;
        b+=data?.data[i+2]||0;
    }

    r = ~~(r/count);
    g = ~~(g/count);
    b = ~~(b/count);

    return {
        r,
        g,
        b
    }
}

export function getColorHex(rgb:string) {
    const hex = rgb.slice(1);
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);

    const brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    if (brightness > 0.5) {
        return '#000';
    }
    return '#fff';
}

export function getColorRGB(rgb:string) {
    const hex = rgb.slice(1);
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);

    const brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    if (brightness > 0.5) {
        return '#000';
    }
    return '#fff';
}

export const options = {
    method: "GET",
    headers: {
        accept: "application/json",
        Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4OWJiODExODczYTgwNjMwMGY1ZTE5NThhYjUzMzhhMiIsInN1YiI6IjYzZTRiNDJlMGU1OTdiMDBjZDdiYTQzOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.jj9_04xOHbR519EDCfhgf9jFAz6AtMGNECxGgeg-i2M",
    },
};

export const fetcher = (url: string) =>
    fetch(url, options).then((res) => res.json());

export const nameGenre = {
    '28': 'Hành Động',
    '12': 'Phiêu Lưu',
    '16': 'Hoạt Hình',
    '35': 'Hài',
    '80': 'Tội Phạm',
    '99': 'Tài Liệu',
    '18': 'Drama',
    '10751': 'Gia Đình',
    '14': 'Kỳ Ảo',
    '36': 'Lịch Sử',
    '27': 'Kinh Dị',
    '10402': 'Âm Nhạc',
    '9648': 'Kỳ Bí',
    '10749': 'Lãng Mạn',
    '878': 'Viễn Tưởng',
    '10770': 'Điện Ảnh Truyền Hình',
    '53': 'Giật Gân',
    '10752': 'Chiến Tranh',
    '37': 'Cao Bồi',
    '10759': 'Hành Động & Phiêu Lưu',
    '10762': 'Trẻ Em',
    '10763': 'Thời Sự',
    '10764': 'Thực Tế',
    '10765': 'Khoa Học Viễn Tưởng & Giả Tưởng',
    '10766': 'Dài Tập',
    '10767': 'Trò Chuyện',
    '10768': 'Chiến Tranh Và Chính Trị',
}