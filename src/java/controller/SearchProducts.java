package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import entity.Brand;
import entity.Color;
import entity.Product;
import entity.Size;
import java.io.IOException;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import model.HibernateUtil;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;

@WebServlet(name = "SearchProducts", urlPatterns = {"/SearchProducts"})
public class SearchProducts extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        Gson gson = new Gson();
        JsonObject responseJsonObject = new JsonObject();
        responseJsonObject.addProperty("success", false);

        // Get request data
        JsonObject requestJsonObject = gson.fromJson(request.getReader(), JsonObject.class);
        Session session = HibernateUtil.getSessionFactory().openSession();

        Criteria criteria = session.createCriteria(Product.class);

        // Add brand filter
        if (requestJsonObject.has("selectedBrand")) {
            String selectedBrand = requestJsonObject.get("selectedBrand").getAsString();
            Brand brand = (Brand) session.createCriteria(Brand.class)
                    .add(Restrictions.eq("name", selectedBrand))
                    .uniqueResult();
            if (brand != null) {
                criteria.add(Restrictions.eq("brand", brand));
            }
        }

        // Add size filter
        if (requestJsonObject.has("selectedSize")) {
            String selectedSize = requestJsonObject.get("selectedSize").getAsString();
            Size size = (Size) session.createCriteria(Size.class)
                    .add(Restrictions.eq("name", selectedSize))
                    .uniqueResult();
            if (size != null) {
                criteria.add(Restrictions.eq("size", size));
            }
        }

        // Add color filter
        if (requestJsonObject.has("selectedColor")) {
            String selectedColor = requestJsonObject.get("selectedColor").getAsString();
            Color color = (Color) session.createCriteria(Color.class)
                    .add(Restrictions.eq("name", selectedColor))
                    .uniqueResult();
            if (color != null) {
                criteria.add(Restrictions.eq("color", color));
            }
        }

        // Add price filter
        Double lowerValue = requestJsonObject.get("lowerValue").getAsDouble();
        Double upperValue = requestJsonObject.get("upperValue").getAsDouble();
        criteria.add(Restrictions.ge("price", lowerValue));
        criteria.add(Restrictions.le("price", upperValue));

        // Add sorting
        String casualSort = requestJsonObject.get("casual_sort").getAsString();
        switch (casualSort) {
            case "Sort by Latest":
                criteria.addOrder(Order.desc("id"));
                break;
            case "Sort by Oldest":
                criteria.addOrder(Order.asc("id"));
                break;
            case "Sort by Name":
                criteria.addOrder(Order.asc("title"));
                break;
            case "Sort by Price":
                criteria.addOrder(Order.asc("price"));
                break;
            default:
            // No sorting
            }

        // Get all product count
        List<Product> productList = criteria.list();
        responseJsonObject.addProperty("allProductCount", productList.size());

        // Set product range
        int firstResult = requestJsonObject.get("firstResult").getAsInt();
        criteria.setFirstResult(firstResult);
        criteria.setMaxResults(3);

        // Get paginated product list
        productList = criteria.list();

        // Remove users from product list
        productList.forEach(product -> product.setUser(null));

        responseJsonObject.add("productList", gson.toJsonTree(productList));
        responseJsonObject.addProperty("success", true);

        response.setContentType("application/json");
        response.getWriter().write(gson.toJson(responseJsonObject));
    }
}
