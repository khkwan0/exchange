import {cookies} from 'next/headers'
import {handleOrder} from '../actions'

export default async function Dashboard() {

  async function onSubmit(formData) {
    'use server'
     const res = await handleOrder(formData)
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <div>
        <div className="border border-white p-6 mt-10">
          <div>
            BUY
          </div>
          <form action={onSubmit}>
            <input type="hidden" name="type" value="buy" />
            <div>
              <div>
                Price
              </div>
              <input type="numeric" name="price" className="bg-white text-black" />
            </div>
            <div>
              <div>
                Amount 
              </div>
              <input type="numeric" name="amount" className="bg-white text-black" />
            </div>
            <button type="submit">Buy</button>
          </form>
        </div>
        <div className="border border-white p-6 mt-10">
          <div>
            SELL 
          </div>
          <form action={onSubmit}>
            <input type="hidden" name="type" value="sell" />
            <div>
              <div>
                Price
              </div>
              <input type="numeric" name="price" className="bg-white text-black" />
            </div>
            <div>
              <div>
                Amount 
              </div>
              <input type="numeric" name="amount" className="bg-white text-black" />
            </div>
            <button type="submit">Sell</button>
          </form>
        </div>
      </div>
    </div>
  )
}
