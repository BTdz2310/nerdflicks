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
        return `rgb(0, 0, 0)`
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

    return `rgb(${r},${g},${b})`
}