function setUp () {
    mySprite = sprites.create(assets.image`bobFacingLeft`, SpriteKind.Player)
    // color.setPalette(color.GrayScale)
    tiles.setCurrentTilemap(tilemap`startingMap`)
    myMinimap = minimap.getImage(minimap.minimap(MinimapScale.Half, 2, 9))
    minimap.includeSprite(myMinimap, mySprite)
}
let myMinimap: Image = null
let mySprite: Sprite = null
class Bob{

    sprite:Sprite = sprites.create(assets.image`bobFacingBackwards`, SpriteKind.Player)
    constructor(){
        tiles.placeOnTile(this.sprite, tiles.getTileLocation(14, 14))
        scene.cameraFollowSprite(this.sprite)
        setUp()
    }
    right(){
        this.sprite.setImage(assets.image`bobFacingRight`)
        this.sprite.setVelocity(50,0)
    }
    left() {
        this.sprite.setImage(assets.image`bobFacingLeft`)
        this.sprite.setVelocity(-50, 0)
    }
    up() {
        this.sprite.setImage(assets.image`bobFacingForwards`)
        this.sprite.setVelocity(0, -50)
    }
    down() {
        this.sprite.setImage(assets.image`bobFacingBackwards`)
        this.sprite.setVelocity(0,50)
    }
    stopX(){   
        this.sprite.vx= 0
    }
    stopY() {
        this.sprite.vy = 0
    }
}
let bob = new Bob
class Map{
    tilemapCenter:Array<number>
    tileMapLocation:Array<number>
    homeTileMap = assets.tilemap`startingMap`
    awayTileMap = assets.tilemap`otherTilemapImage1`
    mapDimentions:number 
    largeMap:Array<Array<Array<Array<number>>>> = []
    biomes: Array<Array<Image>> = [[assets.tile`bigRockTile`], [assets.tile`smallRockTile`],[],[]]
    constructor(){
        this.createlargemap(30)
        //only even numbers(30)
    }
    createlargemap(size:number){
        for (let a = 0; a < size - 1; a++) {
            this.largeMap.push([])
            for (let b = 0; b < size - 1; b++) {
                this.largeMap[a].push([])
            }

        }
        for(let c = 0; c <size-1; c++){
            for(let d = 0; d < size-1; d++){
                let newChunk = this.generateNewChunk()
                this.largeMap[c][d] = newChunk
            }

        }
        this.mapDimentions = size
        this.tilemapCenter = [Math.floor(size/2)-1,Math.floor(size/2)-1]
        this.tileMapLocation = [Math.floor(size / 2) - 1, Math.floor(size / 2) - 1]
    }
    generateNewChunk(){
        let newChunk2:Array<Array<number>> = []
        for (let e = 0; e <= 15; e++) {
            newChunk2.push([])
            for (let f = 0; f <= 15; f++) {
                this.randomTiles(newChunk2,e,f,0)
            }
        }
        return newChunk2
    }
    randomTiles(array: Array<Array<number>>,a:number,b:number,biome:number){
        if (((b == 0) && ((a == 7) || (a == 8))) || ((b == 15) && ((a == 7) || (a == 8)))){
            array[a].push(4)
        }else if(a == 0 ||b== 0 ||a==15 || b== 15){
            array[a].push(1)
        } else if (Math.percentChance(5)){
            array[a].push(2)
        } else if (Math.percentChance(10)) {
            array[a].push(3)
        }else{
            array[a].push(0)
        }
    }
    renderTilemap(){
        for(let g = 0; g <= 15; g++){
            for(let h = 0; h <= 15; h++){
                if (this.largeMap[this.tileMapLocation[0]][this.tileMapLocation[1]][g][h] == 1){
                    tiles.setTileAt(tiles.getTileLocation(g, h), assets.tile`forestTile`)
                    tiles.setWallAt(tiles.getTileLocation(g, h), true)
                } else if (this.largeMap[this.tileMapLocation[0]][this.tileMapLocation[1]][g][h] == 2){
                    tiles.setTileAt(tiles.getTileLocation(g, h), assets.tile`smallStonesTile`)
                } else if (this.largeMap[this.tileMapLocation[0]][this.tileMapLocation[1]][g][h] == 3){
                    tiles.setTileAt(tiles.getTileLocation(g, h), assets.tile`bigRockTile`)
                } else if (this.largeMap[this.tileMapLocation[0]][this.tileMapLocation[1]][g][h] == 0){
                    tiles.setTileAt(tiles.getTileLocation(g, h), assets.tile`grassTile`)
                } else if (this.largeMap[this.tileMapLocation[0]][this.tileMapLocation[1]][g][h] == 4){
                    tiles.setTileAt(tiles.getTileLocation(g, h), assets.tile`gateTile`)
                }
            }
        }

        tiles.setCurrentTilemap(this.awayTileMap)
        tiles.placeOnRandomTile(bob.sprite, assets.tile`grassTile`)
    }
    move(){

        if(this.tileMapLocation == this.tilemapCenter){
            if(bob.sprite.y> 260){
                this.tileMapLocation[1] = this.tileMapLocation[1] - 1
            }else if(bob.sprite.y < 210){
                this.tileMapLocation[1] = this.tileMapLocation[1] + 1
            }else if(bob.sprite.x < 180){
                this.tileMapLocation[0] = this.tileMapLocation[0] - 1
            }else if(bob.sprite.x > 315){
                this.tileMapLocation[0] = this.tileMapLocation[0] + 1
            }
        }else{
            if (bob.sprite.y > 180) {
                this.tileMapLocation[1] = this.tileMapLocation[1] - 1
            } else if (bob.sprite.y < 80) {
                this.tileMapLocation[1] = this.tileMapLocation[1] + 1
            } else if (bob.sprite.x < 80) {
                this.tileMapLocation[0] = this.tileMapLocation[0] - 1
            } else if (bob.sprite.x > 180) {
                this.tileMapLocation[0] = this.tileMapLocation[0] + 1
            }
        }

    }
    loadMap(prePost:Array<number>){
        bob.sprite.setPosition(10,10)
        console.log(this.largeMap[this.tileMapLocation[0]][this.tileMapLocation[1]])
        if(this.tileMapLocation == this.tilemapCenter){
            tiles.setCurrentTilemap(this.homeTileMap)
        } else if (this.tileMapLocation[0] >= this.mapDimentions-1 || this.tileMapLocation[1] >= this.mapDimentions-1 || this.tileMapLocation[0] <= 0 || this.tileMapLocation[1] <= 0){
            game.showLongText("You shouldn't venture this far", DialogLayout.Bottom)
        }else{  
            this.renderTilemap()
        }
    }
}
let map = new Map
let largeMap = map.largeMap
namespace controllers{
    controller.up.onEvent(ControllerButtonEvent.Pressed, function() {
        bob.up()
    })
    controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
        bob.down()
    })
    controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
        bob.right()
    })
    controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
        bob.left()
    })
    controller.up.onEvent(ControllerButtonEvent.Released, function () {
        if (bob.sprite.vy < 0) {
            bob.stopY()
        }
    })
    controller.down.onEvent(ControllerButtonEvent.Released, function () {
        if (bob.sprite.vy > 0) {
            bob.stopY()
        }
    })
    controller.left.onEvent(ControllerButtonEvent.Released, function () {
        if(bob.sprite.vx < 0){
            bob.stopX()        
        }

    })
    controller.right.onEvent(ControllerButtonEvent.Released, function () {
        if (bob.sprite.vx > 0) {
            bob.stopX()
        }
    })    
}
namespace tileOverlaps{

    scene.onOverlapTile(SpriteKind.Player, assets.tile`gateTile`, function(sprite: Sprite, location: tiles.Location) {

        timer.throttle("action", 2000, function() {
            let prePost = map.tileMapLocation
            map.move()
            map.loadMap(prePost)
        })
    })
}
