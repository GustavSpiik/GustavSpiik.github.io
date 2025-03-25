// Tetris game implementation
class Tetris {
    constructor() {
        this.canvas = document.getElementById('game-board');
        this.ctx = this.canvas.getContext('2d');
        this.nextCanvas = document.getElementById('next-piece-canvas');
        this.nextCtx = this.nextCanvas.getContext('2d');
        
        this.blockSize = 30;
        this.cols = 10;
        this.rows = 20;
        this.score = 0;
        this.level = 1;
        this.gameOver = false;
        this.isPaused = false;
        
        // Tetromino shapes
        this.shapes = {
            I: [[1, 1, 1, 1]],
            O: [[1, 1], [1, 1]],
            T: [[0, 1, 0], [1, 1, 1]],
            S: [[0, 1, 1], [1, 1, 0]],
            Z: [[1, 1, 0], [0, 1, 1]],
            J: [[1, 0, 0], [1, 1, 1]],
            L: [[0, 0, 1], [1, 1, 1]]
        };
        
        // Colors for different pieces
        this.colors = {
            I: '#00f0f0',
            O: '#f0f000',
            T: '#a000f0',
            S: '#00f000',
            Z: '#f00000',
            J: '#0000f0',
            L: '#f0a000'
        };
        
        this.board = Array(this.rows).fill().map(() => Array(this.cols).fill(0));
        this.currentPiece = null;
        this.nextPiece = null;
        
        this.bindControls();
        this.init();
    }
    
    init() {
        this.createNewPiece();
        this.draw();
        this.updateScore();
        this.updateLevel();
    }
    
    createNewPiece() {
        const pieces = Object.keys(this.shapes);
        const randomPiece = pieces[Math.floor(Math.random() * pieces.length)];
        
        if (!this.currentPiece) {
            this.currentPiece = {
                shape: this.shapes[randomPiece],
                color: this.colors[randomPiece],
                x: Math.floor(this.cols / 2) - Math.floor(this.shapes[randomPiece][0].length / 2),
                y: 0
            };
        } else {
            this.currentPiece = this.nextPiece;
        }
        
        // Create next piece
        const nextRandomPiece = pieces[Math.floor(Math.random() * pieces.length)];
        this.nextPiece = {
            shape: this.shapes[nextRandomPiece],
            color: this.colors[nextRandomPiece],
            x: Math.floor(this.cols / 2) - Math.floor(this.shapes[nextRandomPiece][0].length / 2),
            y: 0
        };
        
        this.drawNextPiece();
    }
    
    drawNextPiece() {
        this.nextCtx.clearRect(0, 0, this.nextCanvas.width, this.nextCanvas.height);
        const offsetX = (this.nextCanvas.width - this.nextPiece.shape[0].length * this.blockSize) / 2;
        const offsetY = (this.nextCanvas.height - this.nextPiece.shape.length * this.blockSize) / 2;
        
        this.nextPiece.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value) {
                    this.nextCtx.fillStyle = this.nextPiece.color;
                    this.nextCtx.fillRect(
                        offsetX + x * this.blockSize,
                        offsetY + y * this.blockSize,
                        this.blockSize - 1,
                        this.blockSize - 1
                    );
                }
            });
        });
    }
    
    draw() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw board
        this.board.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value) {
                    this.ctx.fillStyle = value;
                    this.ctx.fillRect(
                        x * this.blockSize,
                        y * this.blockSize,
                        this.blockSize - 1,
                        this.blockSize - 1
                    );
                }
            });
        });
        
        // Draw current piece
        if (this.currentPiece) {
            this.ctx.fillStyle = this.currentPiece.color;
            this.currentPiece.shape.forEach((row, y) => {
                row.forEach((value, x) => {
                    if (value) {
                        this.ctx.fillRect(
                            (this.currentPiece.x + x) * this.blockSize,
                            (this.currentPiece.y + y) * this.blockSize,
                            this.blockSize - 1,
                            this.blockSize - 1
                        );
                    }
                });
            });
        }
    }
    
    moveDown() {
        this.currentPiece.y++;
        if (this.checkCollision()) {
            this.currentPiece.y--;
            this.mergePiece();
            this.clearLines();
            this.createNewPiece();
            if (this.checkCollision()) {
                this.gameOver = true;
                this.handleGameOver();
            }
        }
    }
    
    moveLeft() {
        this.currentPiece.x--;
        if (this.checkCollision()) {
            this.currentPiece.x++;
        }
    }
    
    moveRight() {
        this.currentPiece.x++;
        if (this.checkCollision()) {
            this.currentPiece.x--;
        }
    }
    
    rotate() {
        const rotated = this.currentPiece.shape[0].map((_, i) =>
            this.currentPiece.shape.map(row => row[i]).reverse()
        );
        const previousShape = this.currentPiece.shape;
        this.currentPiece.shape = rotated;
        if (this.checkCollision()) {
            this.currentPiece.shape = previousShape;
        }
    }
    
    checkCollision() {
        return this.currentPiece.shape.some((row, y) =>
            row.some((value, x) => {
                if (!value) return false;
                const newX = this.currentPiece.x + x;
                const newY = this.currentPiece.y + y;
                return (
                    newX < 0 ||
                    newX >= this.cols ||
                    newY >= this.rows ||
                    (newY >= 0 && this.board[newY][newX])
                );
            })
        );
    }
    
    mergePiece() {
        this.currentPiece.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value) {
                    this.board[this.currentPiece.y + y][this.currentPiece.x + x] = this.currentPiece.color;
                }
            });
        });
    }
    
    clearLines() {
        let linesCleared = 0;
        for (let y = this.rows - 1; y >= 0; y--) {
            if (this.board[y].every(cell => cell)) {
                this.board.splice(y, 1);
                this.board.unshift(Array(this.cols).fill(0));
                linesCleared++;
                y++;
            }
        }
        if (linesCleared > 0) {
            this.score += linesCleared * 100 * this.level;
            this.updateScore();
            if (this.score >= this.level * 1000) {
                this.level++;
                this.updateLevel();
            }
        }
    }
    
    updateScore() {
        document.getElementById('score').textContent = this.score;
    }
    
    updateLevel() {
        document.getElementById('level').textContent = this.level;
    }
    
    handleGameOver() {
        alert('Spelet är slut! Poäng: ' + this.score);
        this.reset();
    }
    
    reset() {
        this.board = Array(this.rows).fill().map(() => Array(this.cols).fill(0));
        this.score = 0;
        this.level = 1;
        this.gameOver = false;
        this.isPaused = false;
        this.updateScore();
        this.updateLevel();
        this.init();
    }
    
    bindControls() {
        document.addEventListener('keydown', (e) => {
            if (this.gameOver || this.isPaused) return;
            
            switch (e.key) {
                case 'ArrowLeft':
                    this.moveLeft();
                    break;
                case 'ArrowRight':
                    this.moveRight();
                    break;
                case 'ArrowDown':
                    this.moveDown();
                    break;
                case 'ArrowUp':
                    this.rotate();
                    break;
            }
            this.draw();
        });
        
        document.getElementById('start-button').addEventListener('click', () => {
            if (this.gameOver) {
                this.reset();
            }
        });
        
        document.getElementById('pause-button').addEventListener('click', () => {
            this.isPaused = !this.isPaused;
            document.getElementById('pause-button').textContent = this.isPaused ? 'Fortsätt' : 'Pausa';
        });
    }
}

// Initialize game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const game = new Tetris();
    let lastTime = 0;
    
    function gameLoop(timestamp) {
        if (!game.gameOver && !game.isPaused) {
            const deltaTime = timestamp - lastTime;
            if (deltaTime > 1000 / game.level) {
                game.moveDown();
                lastTime = timestamp;
            }
            game.draw();
        }
        requestAnimationFrame(gameLoop);
    }
    
    requestAnimationFrame(gameLoop);
}); 