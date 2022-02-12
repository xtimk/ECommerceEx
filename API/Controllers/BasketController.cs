using System;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class BasketController : BaseApiController
    {
        private readonly StoreContext _context;
        public BasketController(StoreContext context)
        {
            this._context = context; 
        }

        [HttpGet(Name = "GetBasket")]
        public async Task<ActionResult<BasketDto>> GetBasket()
        {
            var basket = await RetrieveBasket(GetBuyerId());

            if (basket == null) return NotFound();

            return basket.MapBasketToDto();
        }

        [HttpPost] // api/basket?productId=3&quantity=2
        public async Task<ActionResult<BasketDto>> AddItemToBasket(int productId, int quantity)
        {
            // get basket
            var basket = await RetrieveBasket(GetBuyerId());
            if (basket == null) // create basket if it does not exist
                basket = CreateBasket();

            // find product, return 404 if product does not exist
            var product = await _context.Products.FindAsync(productId);
            if (product == null) return BadRequest(new ProblemDetails{Title = "Product not found"});

            // add item
            basket.AddItem(product, quantity);

            // save changes
            // SaveChangesAsync returns the number of edited things in DB
            // if it's 0 (or less) there is a problem (nothing has been done), so I have to return a BadRequest 400 error
            var result = await _context.SaveChangesAsync() > 0;

            if (result) 
                return CreatedAtRoute("GetBasket", basket.MapBasketToDto());

            return BadRequest(new ProblemDetails{Title = "Problem saving item to basket"});
        }

        [HttpDelete]
        public async Task<ActionResult> RemoveBasketItem(int productId, int quantity)
        {
            System.Console.WriteLine("deleting..");
            // get basket
            var basket = await RetrieveBasket(GetBuyerId());
            
            if (basket == null) return NotFound();

            // var quantityInBasket = basket.Items.Find(item => item.ProductId == productId).Quantity;
            // if (quantity > quantityInBasket) return BadRequest(new ProblemDetails{Title = "Can't delete more quantity than the one present in the basket"});

            // remove item or reduce quantity
            basket.RemoveItem(productId, quantity);

            // save changes
            var result = await _context.SaveChangesAsync() > 0;
            
            if (result) 
                return StatusCode(201);
            
            return BadRequest(new ProblemDetails{Title = "Can't delete item from basket"});
        }


        private async Task<Basket> RetrieveBasket(string buyerId)
        {

            if(string.IsNullOrEmpty(buyerId))
            {
                Response.Cookies.Delete("buyerId");
                return null;
            }
            return await _context.Baskets
                .Include(i => i.Items)
                .ThenInclude(p => p.Product)
                .FirstOrDefaultAsync(x => x.BuyerId == Request.Cookies["buyerId"]);
        }

        private string GetBuyerId()
        {
            return User.Identity?.Name ?? Request.Cookies["buyerId"];
        }

        private Basket CreateBasket()
        {
            var buyerId = User.Identity?.Name;
            if (string.IsNullOrEmpty(buyerId))
            {
                buyerId = Guid.NewGuid().ToString();
                var cookieOptions = new CookieOptions{
                    IsEssential = true, 
                    Expires = DateTime.Now.AddDays(30)
                };
                Response.Cookies.Append("buyerId", buyerId, cookieOptions);
            }

            var basket = new Basket {
                BuyerId = buyerId
            };

            _context.Baskets.Add(basket);

            return basket;
        }
    }


}