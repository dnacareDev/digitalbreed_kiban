package kr.or.ih.api.web;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import kr.or.ih.api.entity.Crop;
import kr.or.ih.api.entity.Marker;
import kr.or.ih.api.entity.Notice;
import kr.or.ih.api.entity.Outcome;
import kr.or.ih.api.entity.Pagination;
import kr.or.ih.api.entity.User;
import kr.or.ih.api.service.HomeService;
import kr.or.ih.api.service.MapService;

@Controller
public class MapController
{
	@Autowired
	private MapService service;
	
	@Autowired
	private HomeService homeService;
	
	// map 목록
	@RequestMapping("/map")
	public ModelAndView MapList(ModelAndView mv, HttpServletRequest request, @RequestParam(value = "page_num", defaultValue = "1") int page_num)
	{
		HttpSession session = request.getSession();
		
		if(session.getAttribute("user") == null)
		{
			mv.setViewName("redirect:/login");
		}
		else
		{
			User user = (User)session.getAttribute("user");
			
			int count = service.SelectOutcomeCount(user.getUser_username());
			
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
			
			List<Outcome> outcome = service.SelectOutcomeList(user.getUser_username(), offset, limit);
			List<Notice> notice = homeService.SelectNotice(user.getUser_username());

			mv.addObject("outcome", outcome);
			mv.addObject("page", page);
			mv.addObject("notice", notice);
			
			mv.setViewName("map/map_list");
		}
		
		return mv;
	}
	
	// map 상세 조회
	@RequestMapping("/map_detail")
	public ModelAndView MapDetail(ModelAndView mv, HttpServletRequest request, @RequestParam("outcome_id") int outcome_id)
	{
		HttpSession session = request.getSession();
		
		if(session.getAttribute("user") == null)
		{
			mv.setViewName("redirect:/login");
		}
		else
		{
			User user = (User)session.getAttribute("user");
			
			int delete = homeService.DeleteNotice(user.getUser_username(), outcome_id);
			
			Outcome outcome = service.SelectOutcome(outcome_id);
			
			List<Marker> marker = service.SelectMarker(outcome.getMarker_id());
			List<Notice> notice = homeService.SelectNotice(user.getUser_username());
			
			mv.addObject("marker", marker);
			mv.addObject("outcome", outcome);
			mv.addObject("notice", notice);
			
			mv.setViewName("map/map");
		}
		
		return mv;
	}

	// map 신규 등록
	@RequestMapping("/map_add")
	public ModelAndView MapAdd(ModelAndView mv, HttpServletRequest request)
	{
		HttpSession session = request.getSession();
	
		if(session.getAttribute("user") == null)
		{
			mv.setViewName("redirect:/login");
		}
		else
		{
			User user = (User)session.getAttribute("user");
			
			List<Crop> crop = service.SelectCrop();
			List<Notice> notice = homeService.SelectNotice(user.getUser_username());
			
			mv.addObject("crop", crop);
			mv.addObject("notice", notice);
			
			mv.setViewName("map/map_add");
		}
		
		return mv;
	}
	
	// 버전 정보 조회
	@ResponseBody
	@RequestMapping("map/selectMarkerFile")
	public List<Marker> SelectMarkerFile(@RequestParam("marker_id") int marker_id)
	{
		List<Marker> result = service.SelectMarkerFile(marker_id);
		
		return result;
	}
}