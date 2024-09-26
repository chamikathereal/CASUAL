/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import entity.Brand;
import entity.Product;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import model.HibernateUtil;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.criterion.Restrictions;

/**
 *
 * @author ASUS
 */
@WebServlet(name = "LoadBrandProducts", urlPatterns = {"/LoadBrandProducts"})
public class LoadBrandProducts extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        
        JsonObject jsonObject = new JsonObject();
        jsonObject.addProperty("success", false);
        
        Gson gson = new Gson();
        Session session = HibernateUtil.getSessionFactory().openSession();

        try {
            // Get the list of brands
            Criteria criteria1 = session.createCriteria(Brand.class);
            List<Brand> brandList = criteria1.list();
            
            // Create a JSON array to hold brand-product mapping
            JsonArray brandsWithProducts = new JsonArray();

            for (Brand brand : brandList) {
                // Create a JSON object for each brand
                JsonObject brandObject = new JsonObject();
                brandObject.addProperty("brandName", brand.getName());
                brandObject.addProperty("brandId", brand.getId());

                // Query products for the current brand
                Criteria productCriteria = session.createCriteria(Product.class);
                productCriteria.add(Restrictions.eq("brand", brand));
                List<Product> productList = productCriteria.list();

                // Remove the user association (if present)
                for (Product product : productList) {
                    product.setUser(null); // Clean up data
                }

                // Add product list to the brand object
                brandObject.add("products", gson.toJsonTree(productList));

                // Add the brand object to the main JSON array
                brandsWithProducts.add(brandObject);
            }

            // Set the brands with products in the main JSON object
            jsonObject.add("brandsWithProducts", brandsWithProducts);
            jsonObject.addProperty("success", true);
        } catch (Exception e) {
            e.printStackTrace();
            jsonObject.addProperty("message", "An error occurred while loading brand products.");
        } finally {
            session.close();
        }

        response.setContentType("application/json");
        response.getWriter().write(gson.toJson(jsonObject));
    }
}

