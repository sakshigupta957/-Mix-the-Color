export function hexColorShift(color, valueShift){
    let converted = hexToRGB(color)[1];
    let newColors =[];
    converted.forEach((c)=>{
        let C, nC, Color;
        C = c + valueShift;
        nC = (C>255) ? 255 : C;
        Color = (C<0)? 0 : nC;
        newColors.push(Color);
    });
    let newHex = "#";
    newColors.forEach((newColor)=>{
        let hex = newColor.toString(16);
        newHex += hex; 
    });

    return newHex;
}
export function hexToRGB(color){
    let colors = [
        parseInt(color.substring(1, 3), 16),
        parseInt(color.substring(3, 5), 16),
        parseInt(color.substring(5), 16)
    ]
    return [`rgb(${colors[0]},${colors[1]},${colors[2]})`, colors];
}
