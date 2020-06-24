import React, { useState, useCallback, useRef } from 'react'
import produce from 'immer'
import { Button } from 'reactstrap'

const totalRows = 30
const totalCols = 60
let generation = 0

const possibleNeighbors = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0],
  [1, 1],
  [-1, -1],
  [-1, 1],
  [1, -1]
]

const App: React.FC = () => {
  const [grid, setGrid] = useState(() => {
    const rows = []
    for (let i = 0; i < totalRows; i++) {
      rows.push(Array.from(Array(totalCols), () => 0))
    }

    return rows
  })

  const [started, setStarted] = useState(false)
  const startedRef = useRef(started)
  startedRef.current = started

  const reset = () => {
    const rows = []
    for (let i = 0; i < totalRows; i++) {
      rows.push(Array.from(Array(totalCols), () => 0))
    }

    return rows
  }

  const startSim = useCallback(() => {
    if (!startedRef.current) {
      return
    }

    setGrid((g) => {
      return produce(g, gridCopy => {
        for (let i = 0; i < totalRows; i++) {
          for (let k = 0; k < totalCols; k++) {
            let neighbors = 0
            possibleNeighbors.forEach(([x, y]) => {
              const newI = i + x
              const newK = k + y

              // out of bounds checker
              if (newI >= 0 && newI < totalRows && newK >= 0 && newK < totalCols) {
                neighbors += g[newI][newK]
              }
            })

            // applies the rules
            if (neighbors < 2 || neighbors > 3) {
              gridCopy[i][k] = 0
            } else if (g[i][k] === 0 && neighbors === 3) {
              gridCopy[i][k] = 1
            }
          }
        }
      })
    })
    generation += 1
    setTimeout(startSim, 333)
  }, [])

  return (
    <>
    <h1 style={{ textAlign: "center" }}>John Conway's Game of Life</h1>
    <h1 style={{ textAlign: "center" }}> Generation: {generation} </h1>
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${totalCols}, 20px)`,
      justifyContent: "center",
      marginTop: "30px"
    }}>
      {grid.map((rows, i) => 
        rows.map((col, k) => 
          <div 
            key={ `${i}-${k}` }
            onClick={() => {
              const newGrid = produce(grid, gridCopy => {
                gridCopy[i][k] = gridCopy[i][k] ? 0 : 1
              })
              setGrid(newGrid)
            }}
            style={{ 
              width: 20, 
              height: 20, 
              backgroundColor: grid[i][k] ? "cornflowerblue" : undefined, 
              border: "solid 1px black" 
            }} />))}
    </div>
    <div style={{ display: 'flex', justifyContent: "center", marginTop: "10px", marginBottom: "10px" }}>
      <Button color='success' onClick={() => { setStarted(!started); startedRef.current = true; startSim() }}>{started ? "Stop" : "Start"}</Button>
      <Button color='danger' onClick={() => { setGrid(reset()); generation = 0 }} style={{ marginLeft: "10px" }}>Reset</Button>
    </div>
    </>
  )
}

export default App;
