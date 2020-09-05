package studentsync.selfies;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonPrimitive;
import org.apache.commons.io.FileUtils;

import javax.el.CompositeELResolver;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.*;
import java.util.stream.Stream;

import static studentsync.selfies.JSON.array;


@MultipartConfig(fileSizeThreshold=1024*1024*2, maxFileSize=1024*1024*10, maxRequestSize=1024*1024*50)
public class SelfieServlet
    extends JsonServlet
{
    private Authentication authentication;

    @Override
    public void init() throws ServletException {
        super.init();
        authentication = new Authentication(properties);

        String path = getProperty("filesystem.photopath");
        if (path != null) {
            File fileSaveDir = new File(path);
            if (!fileSaveDir.exists())
                fileSaveDir.mkdir();
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp)
        throws ServletException, IOException {
        try {
          System.out.println("req = " + req);
            if (authentication.handle(req, resp)) {
                String save = req.getParameter("save");
                String image = req.getParameter("image");
                if (image != null) {
                    log("image = " + image);
                    String path = getProperty("filesystem.photopath");
                    Part part = req.getPart("image");
                    File targetFile = new File(path + File.separator + image + ".png");
                    InputStream inputStream = part.getInputStream();
                    inputStream.skip("data:image/png;base64,".length());
                    FileUtils.copyInputStreamToFile(Base64.getDecoder().wrap(inputStream), targetFile);
                    //FileUtils.copyInputStreamToFile(Base64.getDecoder().wrap(part.getInputStream()), targetFile);
                    writeResponse(req, resp, new JsonPrimitive("logged out"));
                    req.getSession().removeAttribute("user");
                    req.getSession().invalidate();
                }
                else
                    log("unknown request " + req.getParameterMap());
            }
        }
        catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }

    protected void doGet(HttpServletRequest req, HttpServletResponse resp)
        throws ServletException, IOException
    {
        try {
            String search = req.getParameter("search");
            if (search != null) {
              log("search = " + search);
              writeResponse(req, resp, array(AuthConnection.get(properties).filterIdentities(search)));
            }
        }
        catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }
}
