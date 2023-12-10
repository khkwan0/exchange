import {cookies} from 'next/headers'
import {handleOrder} from '../actions'
import {Input} from '@/components/ui/input'
import {Button} from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"


export default async function Dashboard() {

  async function onSubmit(formData) {
    'use server'
     const res = await handleOrder(formData)
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <div>
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>
              BUY Order
            </CardTitle>
            <CardDescription>
              Place your limit order (BUY) here
            </CardDescription>
          </CardHeader>
          <CardContent>
          <form action={onSubmit}>
            <input type="hidden" name="market_action" value="buy" />
            <input type="hidden" name="type" value="limit" />
            <input type="hidden" name="market" value="btc-usdc" />
            <div>
              <div>
                Price
              </div>
              <Input type="numeric" name="price" />
            </div>
            <div className="mt-10">
              <div>
                Amount 
              </div>
              <Input type="numeric" name="amount" />
            </div>
            <Button type="submit" className="mt-10">Buy</Button>
          </form>
          </CardContent>
        </Card>
        <Card className="mt-10 w-[350px]">
          <CardHeader>
            <CardTitle>
              SELL Order
            </CardTitle>
            <CardDescription>
              Place your limit order (SELL) here
            </CardDescription>
          </CardHeader>
          <CardContent>
          <form action={onSubmit}>
            <input type="hidden" name="market_action" value="sell" />
            <input type="hidden" name="type" value="limit" />
            <input type="hidden" name="market" value="btc-usdc" />
            <div>
              <div>
                Price
              </div>
              <Input type="numeric" name="price" />
            </div>
            <div className="mt-10">
              <div>
                Amount 
              </div>
              <Input type="numeric" name="amount" />
            </div>
            <Button type="submit" className="mt-10">Sell</Button>
          </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
