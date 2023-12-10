import {cookies} from 'next/headers'
import {handleOrder} from '../actions'
import {Input} from '@/components/ui/input'
import {Button} from '@/components/ui/button'

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
              <Input type="numeric" name="price" />
            </div>
            <div>
              <div>
                Amount 
              </div>
              <Input type="numeric" name="amount" />
            </div>
            <Button type="submit">Buy</Button>
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
              <Input type="numeric" name="price" />
            </div>
            <div>
              <div>
                Amount 
              </div>
              <Input type="numeric" name="amount" />
            </div>
            <Button type="submit">Sell</Button>
          </form>
        </div>
      </div>
    </div>
  )
}
