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

@WebServlet(name = "LoadData", urlPatterns = {"/LoadData"})
public class LoadData extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        JsonObject jsonObject = new JsonObject();
        jsonObject.addProperty("success", false);

        Gson gson = new Gson();

        Session session = HibernateUtil.getSessionFactory().openSession();

        //main code set
        //get brandyList from db
        Criteria criteria1 = session.createCriteria(Brand.class);
        List<Brand> brandyList = criteria1.list();
        jsonObject.add("brandyList", gson.toJsonTree(brandyList));

        //get sizeList list from db
        Criteria criteria2 = session.createCriteria(Size.class);
        List<Size> sizeList = criteria2.list();
        jsonObject.add("sizeList", gson.toJsonTree(sizeList));

        //get colorlist from db
        Criteria criteria3 = session.createCriteria(Color.class);
        List<Color> colorList = criteria3.list();
        jsonObject.add("colorList", gson.toJsonTree(colorList));

        //get productList from db
        Criteria criteria4 = session.createCriteria(Product.class);

        //get latest product
        criteria4.addOrder(Order.desc("id"));
        jsonObject.addProperty("allProductCount", criteria4.list().size());

        //set product range
        criteria4.setFirstResult(0);
        criteria4.setMaxResults(6);

        List<Product> productList = criteria4.list();

        //remove users in product
        for (Product product : productList) {
            product.setUser(null);
        }

        jsonObject.add("productList", gson.toJsonTree(productList));
        jsonObject.addProperty("success", true);

        //main code set
        response.setContentType("application/json");
        response.getWriter().write(gson.toJson(jsonObject));

    }

}
