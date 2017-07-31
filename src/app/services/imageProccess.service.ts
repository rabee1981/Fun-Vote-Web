import { Injectable } from '@angular/core';
@Injectable()
export class ImageProccessService {
    convertToDataURLviaCanvas(url, outputFormat){
	return new Promise( (resolve, reject) => {
		let img = new Image();
		img.crossOrigin = 'Anonymous';
		img.onload = () => {
            let canvas = <HTMLCanvasElement> document.createElement('CANVAS'),
            ctx = canvas.getContext('2d'),
            dataURL;
            canvas.height = 166;
            canvas.width = 315;
            ctx.rect(0, 0, 315, 166);
            ctx.fillStyle = "#E9EBEE";
            ctx.fill()
            ctx.globalAlpha = 0.6;
            ctx.drawImage(img,0, 0, img.width, img.height, 0, 0, 315, 166);
			dataURL = canvas.toDataURL(outputFormat);
			canvas = null;
			resolve(dataURL); 
		};
		img.src = url;
	});
}
}