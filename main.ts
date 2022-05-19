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
        for(let a = 0; a <size-1; a++){
            this.largeMap.push([])
            for(let b = 0; b < size-1; b++){
                let newChunk = this.generateNewChunk()
                this.largeMap[a].push([null])
            }

        }
        this.mapDimentions = size
        this.tilemapCenter = [Math.floor(size/2)-1,Math.floor(size/2)-1]
        this.tileMapLocation = [Math.floor(size / 2) - 1, Math.floor(size / 2) - 1]
    }
    generateNewChunk(){
        let newChunk:Array<Array<number>> = []
        for (let a = 0; a < 15; a++) {
            newChunk.push([])
            for (let b = 0; b < 15; b++) {
                this.randomTiles(newChunk,a,b,0)
            }
        }
        return newChunk
    }
    randomTiles(array: Array<Array<number>>,a:number,b:number,biome:number){
        if(a == 0 ||b== 0 ||a==15 || b== 15){
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
        for(let a = 0; a < 15; a++){
            for(let b = 0; b < 15; b++){
                if (this.largeMap[this.tileMapLocation[0]][this.tileMapLocation[1]][a][b] == 1){
                    this.awayTileMap.setTile(a,b,9)
                    tiles.setWallAt(tiles.getTileLocation(a, b), true)
                } else if (this.largeMap[this.tileMapLocation[0]][this.tileMapLocation[1]][a][b] == 2){
                    this.awayTileMap.setTile(a, b, 9)
                    tiles.setWallAt(tiles.getTileLocation(a, b), true)
                } else if (this.largeMap[this.tileMapLocation[0]][this.tileMapLocation[1]][a][b] == 3){
                    this.awayTileMap.setTile(a, b, 9)
                    tiles.setWallAt(tiles.getTileLocation(a, b), true)
                } else if (this.largeMap[this.tileMapLocation[0]][this.tileMapLocation[1]][a][b] == 0){
                    this.awayTileMap.setTile(a, b, 9)
                    tiles.setWallAt(tiles.getTileLocation(a, b), true)
                }
            }
        }
        tiles.setCurrentTilemap(this.awayTileMap)
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
function setUp(){
    /* color.setPalette(color.GrayScale) */
    tiles.setCurrentTilemap(assets.tilemap`startingMap`)
}
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

