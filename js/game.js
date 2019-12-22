class Game {
  constructor(size, steps) {
    this.size = size
    this.steps = steps

    document.querySelector('#width').addEventListener('change', ev => Number(ev.target.value) ? this.size.width = ev.target.value : null)
    document.querySelector('#height').addEventListener('change', ev => Number(ev.target.value) ? this.size.height = ev.target.value : null)
    document.querySelector('#steps').addEventListener('change', ev => Number(ev.target.value) ? this.steps = ev.target.value : null)
    document.querySelector('.startBtn').addEventListener('click', _ => this.start())
  }

  generateGameField() {
    const labyrinthBlockContainer = document.querySelector('.labyrinthBlockContainer')
    labyrinthBlockContainer.innerHTML = ''

    labyrinthBlockContainer.style.gridTemplateColumns = 'repeat(' + this.size.width + ',  minmax(10px, 100px))'
    labyrinthBlockContainer.style.gridTemplateRows = 'repeat(' + this.size.height + ',  minmax(10px, 100px))'

    for (let h = 0; h < this.size.height; h++) {
      for (let w = 0; w < this.size.width; w++) {
        const newDiv = document.createElement('div')
        newDiv.className = 'labyrinthBlock'
        newDiv.dataset.h = h
        newDiv.dataset.w = w
        newDiv.addEventListener('click', ev => this.checkLabyrinthBlock(ev.target))
        labyrinthBlockContainer.append(newDiv)
      }
    }
  }

  generateMarker() {
    this.marker = new GameMarker({ width: this.getRandomNumber(this.size.width), height: this.getRandomNumber(this.size.height) })

    const currentLabyrinthBlock = document.querySelector('.labyrinthBlock[data-h="' + this.marker.position.height + '"][data-w="' + this.marker.position.width + '"]')
    const newMarker = document.createElement('span')
    newMarker.textContent = 'старт'
    currentLabyrinthBlock.classList.add('startBlock')
    currentLabyrinthBlock.append(newMarker)
  }

  generateStepsField() {
    const labyrinthMoveContainer = document.querySelector('.labyrinthMoveContainer')
    labyrinthMoveContainer.innerHTML = ''
    labyrinthMoveContainer.style.gridTemplateColumns = 'repeat(' + (this.steps > 5 ? 5 : this.steps) + ', 3rem)'
    labyrinthMoveContainer.style.gridTemplateRows = 'repeat(' + (this.steps > 5 ? Math.ceil(this.steps / 5) : 1) + ', 3rem)'

    for (let s = 0; s < this.steps; s++) {
      const newDiv = document.createElement('div')
      newDiv.className = 'labyrinthMoveBlock'
      newDiv.dataset.s = s
      labyrinthMoveContainer.append(newDiv)
    }
  }

  simulateSteps() {
    Array.from(document.querySelectorAll('i.arrow')).map(i => i.remove())
    for (let s = 0; s < this.steps; s++) {
      const randomMove = this.getRandomMove()

      const currentStepBlock = document.querySelector('[data-s="' + s + '"]')
      const newIcon = document.createElement('i')
      newIcon.className = 'arrow ' + randomMove
      currentStepBlock.append(newIcon)

      this.move(randomMove)
    }
  }

  start() {
    this.generateGameField()
    this.generateMarker()
    this.generateStepsField()
    this.simulateSteps()
  }

  move(direction) {
    switch (direction) {
      case 'top':
        this.marker.position.height = this.marker.position.height - 1
      break
      case 'right':
        this.marker.position.width = this.marker.position.width + 1
      break
      case 'bottom':
        this.marker.position.height = this.marker.position.height + 1
      break
      case 'left':
        this.marker.position.width = this.marker.position.width - 1
      break
    }
  }

  checkLabyrinthBlock(block) {
    if (block.dataset.h == this.marker.position.height
    && block.dataset.w == this.marker.position.width) {
      block.classList.add('true')
    } else {
      block.classList.add('false')
      document.querySelector('.labyrinthBlock[data-h="' + this.marker.position.height + '"][data-w="' + this.marker.position.width + '"]').classList.add('true')
    }
  }
  
  getRandomMove() {
    const canMove = []
    if (this.marker.position.height !== 0) {
      canMove.push('top')
    }
    if (this.marker.position.width !== this.size.width - 1) {
      canMove.push('right')
    }
    if (this.marker.position.height !== this.size.height - 1) {
      canMove.push('bottom')
    }
    if (this.marker.position.width !== 0) {
      canMove.push('left')
    }
    return canMove[this.getRandomNumber(canMove.length)]
  }

  getRandomNumber(to) {
    return Math.floor(Math.random() * Math.floor(to))
  }
}