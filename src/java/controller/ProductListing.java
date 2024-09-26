package controller;

import com.google.gson.Gson;
import dto.Response_DTO;
import dto.User_DTO;
import entity.Brand;
import entity.Color;
import entity.Product;
import entity.Product_Status;
import entity.Size;
import entity.User;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.util.Date;
import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;
import model.HibernateUtil;
import model.Validations;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.criterion.Restrictions;

@MultipartConfig
@WebServlet(name = "ProductListing", urlPatterns = {"/ProductListing"})
public class ProductListing extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        Response_DTO response_DTO = new Response_DTO();
        Gson gson = new Gson();

        String title = request.getParameter("title");
        String brandId = request.getParameter("brandId");
        String sizeId = request.getParameter("sizeId");
        String colorId = request.getParameter("colorId");

        String qty = request.getParameter("qty");
        String price = request.getParameter("price");
        String description = request.getParameter("description");

        //String description = request.getParameter("description");
        //String storageId = request.getParameter("storageId");
        //String colorId = request.getParameter("colorId");
        //String conditionId = request.getParameter("conditionId");
        //String qty = request.getParameter("qty");
        //String price = request.getParameter("price");
        Part image1 = request.getPart("image1");
        Part image2 = request.getPart("image2");
        Part image3 = request.getPart("image3");
        Part image4 = request.getPart("image4");

        Session session = HibernateUtil.getSessionFactory().openSession();

        if (title.isEmpty()) {
            response_DTO.setContent("Please fill Product Title");

        } else if (!Validations.isInteger(brandId)) {
            response_DTO.setContent("Invalid Brand");

        } else if (!Validations.isInteger(sizeId)) {
            response_DTO.setContent("Invalid Size");

        } else if (!Validations.isInteger(colorId)) {
            response_DTO.setContent("Invalid color");

        } else if (price.isEmpty()) {
            response_DTO.setContent("Please fill price");

        } else if (!Validations.isDouble(price)) {
            response_DTO.setContent("Invalid price");

        } else if (Double.parseDouble(price) <= 0) {
            response_DTO.setContent("Invalid price");

        } else if (qty.isEmpty()) {
            response_DTO.setContent("Please fill qty");

        } else if (!Validations.isInteger(qty)) {
            response_DTO.setContent("Invalid qty");

        } else if (Integer.parseInt(qty) <= 0) {
            response_DTO.setContent("Invalid qty");

        } else if (description.isEmpty()) {
            response_DTO.setContent("Please fill description");

        } else if (image1.getSubmittedFileName() == null) {
            response_DTO.setContent("please upload image 1");

        } else if (image2.getSubmittedFileName() == null) {
            response_DTO.setContent("please upload image 2");

        } else if (image3.getSubmittedFileName() == null) {
            response_DTO.setContent("please upload image 3");

        } else if (image4.getSubmittedFileName() == null) {
            response_DTO.setContent("please upload image 4");
        } else {

            Brand brand = (Brand) session.get(Brand.class, Integer.parseInt(brandId));

            if (brand == null) {
                response_DTO.setContent("invalid brand");

            } else {

                Size size = (Size) session.get(Size.class, Integer.parseInt(sizeId));

                if (size == null) {
                    response_DTO.setContent("please select a valid Size");

                } else {

                    Color color = (Color) session.get(Color.class, Integer.parseInt(colorId));

                    if (color == null) {
                        response_DTO.setContent("please select a valid color");

                    } else {
                        System.out.println("1");
                        Product product = new Product();
                        product.setBrand(brand);
                        product.setSize(size);
                        product.setColor(color);
                        product.setDate_time(new Date());
                        product.setDescription(description);
                        System.out.println("2");
                        product.setPrice(Double.parseDouble(price));

                        Product_Status product_Status = (Product_Status) session.load(Product_Status.class, 1);
                        product.setProduct_status(product_Status);
                        product.setTitle(title);
                        product.setQty(Integer.parseInt(qty));

                        System.out.println("4");

                        //get user
                        User_DTO user_DTO = (User_DTO) request.getSession().getAttribute("user");
                        Criteria criteria = session.createCriteria(User.class);
                        criteria.add(Restrictions.eq("email", user_DTO.getEmail()));
                        User user = (User) criteria.uniqueResult();
                        product.setUser(user);

                        System.out.println("5");

                        int pid = (int) session.save(product);
                        session.beginTransaction().commit();
                        System.out.println("6");

                        String applicationPath = request.getServletContext().getRealPath("");
                        String newApplicationPath = applicationPath.replace("build" + File.separator + "web", "web");

                        File folder = new File(newApplicationPath + "//product-images//" + pid);
                        folder.mkdir();
                        System.out.println("7");
                        
                        File file1 = new File(folder, "image1.png");
                        InputStream inputStream1 = image1.getInputStream();
                        Files.copy(inputStream1, file1.toPath(), StandardCopyOption.REPLACE_EXISTING);

                        File file2 = new File(folder, "image2.png");
                        InputStream inputStream2 = image2.getInputStream();
                        Files.copy(inputStream2, file2.toPath(), StandardCopyOption.REPLACE_EXISTING);

                        File file3 = new File(folder, "image3.png");
                        InputStream inputStream3 = image3.getInputStream();
                        Files.copy(inputStream3, file3.toPath(), StandardCopyOption.REPLACE_EXISTING);

                        File file4 = new File(folder, "image4.png");
                        InputStream inputStream4 = image4.getInputStream();
                        Files.copy(inputStream4, file4.toPath(), StandardCopyOption.REPLACE_EXISTING);
                        
                        System.out.println("8");
                        response_DTO.setSuccess(true);
                        response_DTO.setContent("New product added");
                        System.out.println("9");

                    }

                }

            }

        }

        response.setContentType("application/json");
        response.getWriter().write(gson.toJson(response_DTO));
        System.out.println(gson.toJson(response_DTO));

        session.close();

    }

}
