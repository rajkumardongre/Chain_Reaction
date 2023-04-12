document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('grid')
    const newBtn = document.getElementById("newBtn")
    newBtn.addEventListener("click", (e) => {
        location.reload()
    })
    let rows = 11
    let cols = 6
    let gameOver = false    
    let squares = []
    let noClick = 0
    grid.style.height = rows * 45  + "px"
    grid.style.width = cols * 45 + "px"
    // Create a rows x cols matrix filled with zeros
    const matrix = [];
    for (let i = 0; i < rows; i++) {
        matrix[i] = new Array(cols).fill(0);
    }
    let isPlayer1 = true
    let title = document.getElementById("title")
    let turn = document.getElementById("turn")

    //create Board
    function createBoard () {
        for(let i = 0; i < rows*cols; i++) {
            const square = document.createElement('div')
            square.setAttribute('id', i)
            square.setAttribute('class', "cell")
            square.innerText = 0
            grid.appendChild(square)
            squares.push(square)
            //normal click
            square.addEventListener('click', function(e) {
              click(square, false)
            })
        }  
    }
    createBoard()

    function checkGameOver(){
        if(noClick > 2){
            let p1 = false
            let p2 = false
            for(let i=0; i<rows*cols; i++){
                if(squares[i].classList.contains("p1")){
                    p1 = true
                }
                if(squares[i].classList.contains("p2")){
                    p2 = true
                }    
            }
            if ((p1 && p2) == false){
                // console.log(p1, p2)
                if(isPlayer1){
                    turn.style.color = "red"
                    turn.innerText = "Game Over, Red is Winner"
                }else{
                    turn.style.color = "blue"
                    turn.innerText = "Game Over, Blue is Winner"
                }
                gameOver = true
                return true
            }
        }
        return false
    }
    function changeTitleColor(){
        if(isPlayer1){
            title.style.color = "blue";
            turn.style.color = "blue";
            turn.innerText = "Blue Turn"
        }else{
            title.style.color = "red"
            turn.style.color = "red";
            turn.innerText = "Red Turn"
        }
    }
    changeTitleColor()
    
    // Click 
    function click(e, rec){
        
        // console.log(matrix)
        // Extracting row and column
        const elementID = parseInt(e.id);
        let row = 0, col = 0;
        if(elementID < cols) {
            row = 0
            col = elementID
        }else{
            row = parseInt(elementID / cols);
            col = elementID % cols;
        }
        // console.log("Clicked", e, row, col)
        
        if(rec){
            if(isPlayer1){
                if(!e.classList.contains("p1"))
                    e.classList.add("p1");
                e.classList.remove("p2")
                matrix[row][col] += 1
                checkExplode(row, col, parseInt(elementID), true, rec)
                e.innerText = matrix[row][col]
                if(checkGameOver()){
                    title.style.color = "white"
                    title.innerText = "Game Over"
                    return
                }
                // if(rec) return;
            }else{
                if(!e.classList.contains("p2"))
                    e.classList.add("p2");
                e.classList.remove("p1")
                matrix[row][col] += 1
                checkExplode(row, col, parseInt(elementID), true, rec)
                e.innerText = matrix[row][col]
                if(checkGameOver()){
                    title.style.color = "white"
                    title.innerText = "Game Over"
                    return
                }
            }
        }
        else if(isPlayer1 && !e.classList.contains("p2") && !rec){
            noClick++
            if(!e.classList.contains("p1"))
            e.classList.add("p1");
            matrix[row][col] += 1
            checkExplode(row, col, parseInt(elementID), true)
            e.innerText = matrix[row][col]
            if(rec) return;
            isPlayer1 = false;
            changeTitleColor()
            if(checkGameOver()){
                title.style.color = "white"
                title.innerText = "Game Over"
                return
            }
        }else if (!isPlayer1 && !e.classList.contains("p1") && !rec){
            noClick++
            if(!e.classList.contains("p1"))
            e.classList.add("p2");
            matrix[row][col] += 1
            checkExplode(row, col, parseInt(elementID), false)
            e.innerText = matrix[row][col]
            if(rec) return;
            isPlayer1 = true;
            changeTitleColor()
            if(checkGameOver()){
                title.style.color = "white"
                title.innerText = "Game Over"
                return
            }
        }
    }

    // Check Explode
    
    function checkExplode(row, col, elementID) {
        // Explode on 2 weight
        if(row == 0 && col == 0 && matrix[row][col] == 2){
            matrix[row][col] = 0
            squares[elementID].classList.remove("p1")
            squares[elementID].classList.remove("p2")
            click(squares[elementID + 1], true)
            click(squares[elementID + cols], true)
        }else if(row == 0 && col == cols - 1 && matrix[row][col] == 2){
            matrix[row][col] = 0
            squares[elementID].classList.remove("p1")
            squares[elementID].classList.remove("p2")
            click(squares[elementID -1], true)
            click(squares[elementID + cols], true)
        }else if(row == rows - 1 && col == 0 && matrix[row][col] == 2){
            matrix[row][col] = 0
            squares[elementID].classList.remove("p1")
            squares[elementID].classList.remove("p2")
            click(squares[elementID + 1], true)
            click(squares[elementID - cols], true)
        }else if(row == rows - 1 && col == cols - 1 && matrix[row][col] == 2){
            matrix[row][col] = 0
            squares[elementID].classList.remove("p1")
            squares[elementID].classList.remove("p2")
            click(squares[elementID - 1], true)
            click(squares[elementID - cols], true)
        }
        // Explode on 3 weight
        else if(col == 0 && matrix[row][col] == 3){
            matrix[row][col] = 0
            squares[elementID].classList.remove("p1")
            squares[elementID].classList.remove("p2")
            click(squares[elementID - cols], true)
            click(squares[elementID + 1], true)
            click(squares[elementID + cols], true)
        }else if(col == cols - 1 && matrix[row][col] == 3){
            matrix[row][col] = 0
            squares[elementID].classList.remove("p1")
            squares[elementID].classList.remove("p2")
            click(squares[elementID - cols], true)
            click(squares[elementID - 1], true)
            click(squares[elementID + cols], true)
        }else if(row == 0 && matrix[row][col] == 3){
            matrix[row][col] = 0
            squares[elementID].classList.remove("p1")
            squares[elementID].classList.remove("p2")
            click(squares[elementID - 1], true)
            click(squares[elementID + cols], true)
            click(squares[elementID + 1], true)
        }else if(row == rows - 1 && matrix[row][col] == 3){
            matrix[row][col] = 0
            squares[elementID].classList.remove("p1")
            squares[elementID].classList.remove("p2")
            click(squares[elementID - 1], true)
            click(squares[elementID - cols], true)
            click(squares[elementID + 1], true)
        }else if(matrix[row][col] == 4){
            matrix[row][col] = 0
            squares[elementID].classList.remove("p1")
            squares[elementID].classList.remove("p2")
            click(squares[elementID - 1], true)
            click(squares[elementID + 1], true)
            click(squares[elementID - cols], true)
            click(squares[elementID + cols], true)
        }
        // isPlayer1 = isp1
    }
})
  