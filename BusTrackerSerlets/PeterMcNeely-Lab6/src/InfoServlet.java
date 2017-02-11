

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Enumeration;
import java.util.Date;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet implementation class InfoServlet
 */
@WebServlet(urlPatterns = {"/info.do"})
public class InfoServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public InfoServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

    /**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		PrintWriter pw = new PrintWriter(response.getWriter());
		pw.println("<!DOCTYPE html><html><head><meta charset=\"ISO-8859-1\"><title>Peter McNeely's Lab 6</title><link rel=\"stylesheet\" href=\"lab6.css\" type=\"text/css\"/></head>");
		pw.println("<body class=\"container-fluid\"><div class=\"systemInfo\"><h1>System Info</h1>");
		systemInfo(pw);
		pw.println("<div class=\"headers\"><h1>HTTP Headers</h1>");
		httpHeaders(request, pw);
		pw.println("<div class=\"response\"><h1>Request Paramerters</h1>");
		requestParameters(request, pw);
		pw.println("</body></html>");
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}

	/**
	 * Prints out the system info based on the specs of the server
	 * @param pw the print writer to print everything to the webpage.
	 */
	private void systemInfo(PrintWriter pw){
		String allInfo = "<p>";
		allInfo += "Today is " + new Date().toString() +"<br>";
		allInfo += "The current thread is " + Thread.currentThread().getId() + "<br>";
		allInfo += "The current java.home is " + System.getProperty("java.home") + "<br>"; 
		allInfo += "The current java.version is " + System.getProperty("java.version")+ "<br>";
		allInfo += "The current java.runtime.name is " + System.getProperty("java.runtime.name")+ "<br>";
		allInfo += "The current java.runtime.version is " + System.getProperty("java.runtime.version")+ "<br>";
		allInfo += "The current java.specification.version is " + System.getProperty("java.specification.version")+ "<br>";
		allInfo += "The current java.vm.version is " + System.getProperty("java.vm.version")+ "<br>";
		allInfo += "The current os.name is " + System.getProperty("os.name")+ "<br>";
		pw.println(allInfo +"</p></div>");
	}

	/**
	 * Prints out the HTTP header information that you are getting back from the request
	 * @param request the HTTPServletRequest object to print information to the webpage
	 * @param pw the print writer to print to the webpage
	 */
	private void httpHeaders(HttpServletRequest request, PrintWriter pw){
		String info = "<p>";
        Enumeration<String> headerNames = request.getHeaderNames();
        while (headerNames.hasMoreElements()){
        	String headerName = headerNames.nextElement();
        	info += headerName + " : " + request.getHeader(headerName) + "<br>";
        }
        pw.println(info +"</p></div>"); 
	}
	
	/**
	 * Prints out all of the request parameters to the webpage
	 * @param request the HTTPServletRequest object used to pull information form the parameters
	 * @param pw the print writer used to write to the webpage
	 */
	private void requestParameters(HttpServletRequest request, PrintWriter pw) {
		String params = "<p>";
        Enumeration<String> parameterNames = request.getParameterNames();
        while (parameterNames.hasMoreElements()){
        	String parameterName = parameterNames.nextElement();
        	params += parameterName + " : " + request.getParameter(parameterName) + "<br>";
        }
        pw.println(params + "</p></div>");
	}

}
