import { Dimensions } from "react-native"
export const {width, height} = Dimensions.get('screen')
export const BOX_PADDING = 0
export const MARGIN_BOTTOM = 10
export const MARGIN_TOP = 30
export const DROPBOX_HEIGHT = 200
export const DROPBOX_WIDTH = width - 32

const isSelected = (offset) => {
    "worklet";
    return offset.order.value !== -1;
}
const byOrder = (a, b) => {
    "worklet";
    return a.order.value > b.order.value ? 1 : -1;
}
const byHeight = (a, b) => {
    return a.height.value > b.height.value ? 1 : -1;
}
const wbyHeight = (a, b) => {
    "worklet";
    return a.height.value > b.height.value ? 1 : -1;
}
const wbyY = (a, b) => {
    "worklet";
    return a.y.value > b.y.value ? 1 : -1;
}

export const calculateBuffer = (_offsets) => {
    if(_offsets.length == 0){
        return 0
    }
    const highestPoint = _offsets[0].initialY.value
    const lowestPoint = _offsets[_offsets.length - 1].initialY.value
    const offsets = _offsets.filter((offset) => offset.initialY.value == lowestPoint).sort(byHeight)
    return offsets[offsets.length - 1].height.value + lowestPoint - highestPoint
}

export const calculateLayout = (_offsets, group, borders) => {
    "worklet";

    const offsets = _offsets.filter((offset) => offset.group.value == group).sort(byOrder)

    if(offsets.length == 0){
        return
    }

    let row = 0
    let rows = [[]]
    let startingOffset = 0
    let lineBreak = borders[borders.length - group - 1][0].value

    offsets.forEach((offset, index) => {

        let widthTaken = offsets
        .slice(startingOffset, index)
        .reduce((previous, current) => previous + current.width.value, 0)

        if(widthTaken + offset.width.value > DROPBOX_WIDTH){

            let maxHeight = 0

            rows[row].forEach((height, index) => {
                if(maxHeight < height) {
                    maxHeight = height
                }
            });

            lineBreak += (maxHeight)
            startingOffset = index
            offset.x.value = 0
            rows.push([])
            row += 1
            rows[row].push(offset.height.value)
        }
        else {
            offset.x.value = widthTaken
            rows[row].push(offset.height.value)
        }
        offset.y.value = lineBreak
    });
}

export const calculateTopOffset = (borders) => {
    "worklet";
    if(borders.length == 0){
        return 0
    }
    return borders[borders.length - 1][1].value + MARGIN_TOP
}

export const remove = (_offsets, _offset) => {
    "worklet";
    let offsets = _offsets.filter((offset) => offset.group.value === _offset.group.value).filter((offset) => offset.order.value !== _offset.order.value).sort(byOrder)
    offsets.filter((offset) => offset.group.value === _offset.group.value).map((offset, index) => offset.order.value = index)
}

export const getLastOrder = (_offsets, group) => {
    "worklet";
    return _offsets.filter((offset) => offset.group.value == group).length
}

export const isInGroup = (y, borders) => {
    "worklet";
    for(let i = 0; i < borders.length; i++) {
        if(y > borders[i][0].value && y < borders[i][1].value) {
            return true
        }  
    }
    return false
}

export const setGroup = (y, borders, _offset) => {
    "worklet";
    for(let i = 0; i < borders.length; i++) {
        if(y > borders[i][0].value && y < borders[i][1].value) {
            _offset.group.value = borders.length - i - 1
        }  
    }
}


export const belongsTo = (_group, y, borders) => {
    "worklet";
    return (y > borders[_group][0].value && y < borders[_group][1].value)
}

export const calculateHeight = (_offsets, _borderIndex, _borders) => {
    "worklet";
    const offsets = _offsets.filter((offset) => offset.group.value == _borders.length - _borderIndex - 1)
    if(offsets.length == 0){
        return DROPBOX_HEIGHT 
    }
    const sortedbyY = offsets.sort(wbyY)
    const highestPoint = sortedbyY[0].y.value
    const lowestPoint = sortedbyY[sortedbyY.length - 1].y.value
    const sortedbyHeight = offsets.filter((offset) => offset.y.value == lowestPoint).sort(wbyHeight)
    const height = sortedbyHeight[sortedbyHeight.length - 1].height.value + lowestPoint - highestPoint
    if(height > DROPBOX_HEIGHT){
        return height
    }
    return DROPBOX_HEIGHT
}

export const addOffset = (_offsets, _borders, _offset) => {
    "worklet";
    const borderIndex = _borders.length - _offset.group.value - 1
    const newHeight = calculateHeight(_offsets, borderIndex, _borders)
    _borders.forEach((border, index) => {
        if(index == borderIndex){
                const extraValue = newHeight - (border[1].value - border[0].value)
                _offsets.forEach(offset => {
                    if(offset.group.value == -1){
                        offset.originalY.value += extraValue
                    } else if(offset.group.value < _offset.group.value) {
                        offset.y.value += extraValue
                    }
                });
                if(_borders.length !== borderIndex + 1){
                    // console.log("at first : " , _borders.slice(borderIndex + 1))
                    _borders.slice(borderIndex + 1).map((element, index) => {
                        // console.log("ret" , extraValue
                        // console.log(element)
                        element[0].value += extraValue
                        element[1].value += extraValue
                        // console.log(element)
                    })
                    // console.log("result : " , _borders.slice(borderIndex + 1))
                }
                border[1].value += extraValue
            }
    });
}

export const removeOffset = (_offsets, _borders, _offset) => {
    "worklet";

    const borderIndex = _borders.length - _offset.group.value - 1
    const offsets = _offsets.filter((offset) => offset.group.value == _offset.group.value).filter((offset) => offset.order.value !== _offset.order.value)
    const newHeight = calculateHeight(offsets, borderIndex, _borders)

    _borders.forEach((border, index) => {
        if(index == borderIndex){
            const extraValue = newHeight - (border[1].value - border[0].value)
                _offsets.forEach(offset => {
                    if(offset.group.value == -1){
                        offset.originalY.value += extraValue
                    } else if(offset.group.value < _offset.group.value) {
                        offset.y.value += extraValue
                    }
                });
                if(_borders.length !== borderIndex + 1){
                    // console.log("at first : " , _borders.slice(borderIndex + 1))
                    _borders.slice(borderIndex + 1).map((element, index) => {
                        // console.log("ret" , extraValue
                        // console.log(element)
                        element[0].value += extraValue
                        element[1].value += extraValue
                        // console.log(element)
                    })
                    // console.log("result : " , _borders.slice(borderIndex + 1))
                }
                border[1].value += extraValue
            }
    });
}
