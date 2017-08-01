import { Pipe, PipeTransform } from '@angular/core'
@Pipe({
    name : 'thousand'
})

export class ThousandPipe implements PipeTransform{
    transform(value : number) : string{
        if(value<1000)
            return value.toString()
        if(value>=1000 && value<1000000)
            return Math.floor(value/1000).toString().concat('k')
        return Math.floor(value/1000000).toString().concat('M')
    }
}