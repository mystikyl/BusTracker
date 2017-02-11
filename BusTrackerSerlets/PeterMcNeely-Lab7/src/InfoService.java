

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Date;
import java.util.Enumeration;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

/**
 * Servlet implementation class InfoService
 */
@WebServlet(description = "Peter McNeely's info service", urlPatterns= {"/InfoService"})
public class InfoService extends HttpServlet {
	private static final long serialVersionUID = 1L;
       

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		PrintWriter pw = new PrintWriter(response.getWriter());
		response.setContentType("application/json");
		String type = "";
        Enumeration<String> parameterNames = request.getParameterNames();
        while (parameterNames.hasMoreElements()){
        	String temp = parameterNames.nextElement();
        	if (temp.equals("info")){
        		type = request.getParameter(temp);
        	}
        	break;
        }
        switch (type){
        	case "headers":
        		sendHeaders( request, pw);
        		break;
        	case "params":
        		sendParams(request, pw);
        		break;
        	case "system":
        		sendSystem(pw);
        		break;
        	case "request":
        		sendRequest(request, pw);
        		break;
        	case "":
        		sendNoParams(pw);
        		break;
        	default:
        		sendError( pw);
        		break;
        }
    }
	
	private void sendError(PrintWriter pw) {
		JSONObject jso = new JSONObject();
		jso.put("error", "invalid request parameter");
		pw.print(jso.toJSONString());
	}

	private void sendNoParams(PrintWriter pw) {
		JSONObject jso = new JSONObject();
		jso.put("error", "missing request parameter");
		pw.print(jso.toJSONString());
	}

	private void sendHeaders(HttpServletRequest request, PrintWriter pw){
		JSONObject data = new JSONObject();
		JSONObject jso1 = new JSONObject();
        Enumeration<String> headerNames = request.getHeaderNames();
        while (headerNames.hasMoreElements()){
        	String headerName = headerNames.nextElement();
        	data.put(headerName, request.getHeader(headerName));
        }
        jso1.put("data", data);
        jso1.put("status", "ok");
        String jsonString = jso1.toJSONString();
        pw.print(jsonString); 
	}
	
	private void sendSystem(PrintWriter pw){
		JSONObject jso = new JSONObject();
		jso.put("date", new Date().toString());
		jso.put("thread", Thread.currentThread().getId());
		jso.put("javaHome", System.getProperty("java.home"));
		jso.put("javaVersion", System.getProperty("java.version"));
		jso.put("javaRuntimeName", System.getProperty("java.runtime.name"));
		jso.put("javaRuntimeVersion",  System.getProperty("java.runtime.version"));
		jso.put("javaSpecificationVerion", System.getProperty("java.specification.version"));
		jso.put("javaVmMVersion", System.getProperty("java.vm.version"));
		jso.put("osName", System.getProperty("os.name"));
		JSONObject jso1 = new JSONObject();
		jso1.put("data", jso);
		jso1.put("status", "ok");
		pw.print(jso1.toJSONString());	
	}
	
	private void sendParams(HttpServletRequest request, PrintWriter pw){
		JSONArray data = new JSONArray();
		JSONObject jso = new JSONObject();
		Enumeration<String> parameterNames = request.getParameterNames();
        while (parameterNames.hasMoreElements()){
        	JSONObject jso1 = new JSONObject();
        	String parameterName = parameterNames.nextElement();
        	jso1.put("name",parameterName);
        	jso1.put("value", request.getParameter(parameterName));
        	data.add(jso1);
        }
        jso.put("data", data);
        jso.put("status", "ok");
        pw.print(jso.toJSONString());
	}
	
	private void sendRequest(HttpServletRequest request, PrintWriter pw){
		JSONObject data = new JSONObject();
		JSONObject jso = new JSONObject();
		data.put("protocol", request.getProtocol());
		data.put("scheme", request.getScheme());
		data.put("serverPort", request.getServerPort());
		data.put("secure", request.isSecure());
		data.put("method", request.getMethod());
		data.put("contentType", request.getContentType());
		data.put("authType", request.getAuthType());
		data.put("serverName", request.getServerName());
		data.put("contentLength", request.getContentLength());
		data.put("remoteHost", request.getRemoteHost());
		data.put("remoteAddr", request.getRemoteAddr());
		jso.put("data", data);
		jso.put("status", "ok");
		pw.print(jso.toJSONString());
	}
}


	


