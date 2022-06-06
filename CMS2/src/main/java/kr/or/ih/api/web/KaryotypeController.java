package kr.or.ih.api.web;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import kr.or.ih.api.entity.Marker;
import kr.or.ih.api.entity.Notice;
import kr.or.ih.api.entity.Pagination;
import kr.or.ih.api.service.HomeService;
import kr.or.ih.api.service.KaryotypeService;
import kr.or.ih.api.entity.User;
import kr.or.ih.api.service.LoginService;

@Controller
public class KaryotypeController
{
	@Autowired
	private KaryotypeService service;
	private LoginService service_login;
	
	@Autowired
	private HomeService homeService;
	
	@RequestMapping("/karyotype_list")
	public ModelAndView KaryotypeList(ModelAndView mv, HttpServletRequest request, @RequestParam(value = "page_num", defaultValue = "1") int page_num)
	{
		HttpSession session = request.getSession();
		
	
		//if(session.getAttribute("user") == null)
		//{
		//	User user_login = service_login.SelectUser("admin", "test");			
		//	session.setAttribute("user", user_login);
			//mv.setViewName("redirect:/login");
		//}
		//else
		//if(session.getAttribute("user") != null)
		//{
			
			
			int count = service.SelectMarkerCount();
			
			int limit = 10;
			int offset = (page_num - 1) * limit;
			int start_page = ((page_num - 1) / 5) * 5 + 1;
			int end_page = (count + limit - 1) / limit;
			
			Pagination page = new Pagination();
			page.setCount(count);
			page.setPage_num(page_num);
			page.setStart_page(start_page);
			page.setEnd_page(end_page);
			page.setOffset(offset);
			page.setLimit(limit);

			if(session.getAttribute("user") != null) {
				User user = (User)session.getAttribute("user");
				List<Notice> notice = homeService.SelectNotice(user.getUser_username());
				
				mv.addObject("notice", notice);
			}
			List<Marker> marker = service.SelectMarkerList(offset, limit);
			mv.addObject("marker", marker);
			mv.addObject("page", page);

			mv.setViewName("karyotype/karyotype_list");
		//}
		
			return mv;
	}
	
	@RequestMapping("/karyotype_detail")
	public ModelAndView KaryotypeDetail(ModelAndView mv, HttpServletRequest request, @RequestParam("marker_id") int marker_id)
	{
		HttpSession session = request.getSession();
		
		//if(session.getAttribute("user") == null)
		//{
		//	session.setAttribute("user", "test");
			//mv.setViewName("redirect:/login");
		//}
		//else
		//{		
			List<Marker> marker = service.SelectMarkerDetail(marker_id);
			if(session.getAttribute("user") != null) {
				User user = (User)session.getAttribute("user");
				List<Notice> notice = homeService.SelectNotice(user.getUser_username());				
				mv.addObject("notice", notice);
			}
			mv.addObject("marker", marker);
			mv.setViewName("karyotype/karyotype_detail");
		//}
		
		return mv;
	}
}