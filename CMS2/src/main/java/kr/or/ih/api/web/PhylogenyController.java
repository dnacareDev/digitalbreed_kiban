package kr.or.ih.api.web;

import java.io.File;
import java.io.IOException;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;

import kr.or.ih.api.entity.Notice;
import kr.or.ih.api.entity.Outcome;
import kr.or.ih.api.entity.Pagination;
import kr.or.ih.api.entity.User;
import kr.or.ih.api.service.HomeService;
import kr.or.ih.api.service.PhylogenyService;

@Controller
public class PhylogenyController 
{
	@Autowired
	private PhylogenyService service;
	
	@Autowired
	private HomeService homeService;
	
	@RequestMapping("/phylogeny")
	public ModelAndView PhylogenyList(ModelAndView mv, HttpServletRequest request, @RequestParam(value = "page_num", defaultValue = "1") int page_num)
	{
		HttpSession session = request.getSession();
		
		//if(session.getAttribute("user") == null)
		//{
		//	mv.setViewName("redirect:/login");
		//}
		//else
		//{
			User user = (User)session.getAttribute("user");
			
			int count = service.SelectOutcomeCount("liberty@dnacare.co.kr");
			
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
			
			List<Outcome> outcome = service.SelectOutcomeList("liberty@dnacare.co.kr", offset, limit);
			List<Notice> notice = homeService.SelectNotice("liberty@dnacare.co.kr");

			mv.addObject("outcome", outcome);
			mv.addObject("notice", notice);
			mv.addObject("page", page);
			
			mv.setViewName("phylogeny/phylogeny_list");
		//}
		
		return mv;
	}
	
	@RequestMapping("/phylogeny_detail")
	public ModelAndView PhylogenyDetail(ModelAndView mv, HttpServletRequest request, @RequestParam("outcome_id") int outcome_id)
	{
		HttpSession session = request.getSession();
		
		//if(session.getAttribute("user") == null)
		//{
		//	mv.setViewName("redirect:/login");
		//}
		//else
		//{
			User user = (User)session.getAttribute("user");
			
			int delete = homeService.DeleteNotice("liberty@dnacare.co.kr", outcome_id);

			Outcome outcome = service.SelectOutcome(outcome_id);
			List<Notice> notice = homeService.SelectNotice("liberty@dnacare.co.kr");

			mv.addObject("outcome", outcome);
			mv.addObject("notice", notice);
			
			mv.setViewName("phylogeny/phylogeny_detail");
		//}
		
		return mv;
	}
	
	@RequestMapping("/phylogeny_add")
	public ModelAndView PhylogenyAdd(ModelAndView mv, HttpServletRequest request)
	{
		HttpSession session = request.getSession();
		
		//if(session.getAttribute("user") == null)
		//{
		//	mv.setViewName("redirect:/login");
		//}
		//else
		//{
			User user = (User)session.getAttribute("user");

			List<Notice> notice = homeService.SelectNotice("liberty@dnacare.co.kr");

			mv.addObject("notice", notice);
			
			mv.setViewName("phylogeny/phylogeny_add");
		//}
		
		return mv;
	}
	
	@ResponseBody
	@RequestMapping("insertPhylogeny")
	public String InsertPhylogeny(@RequestParam("file") MultipartFile file)
	{
		Date date = new Date();
		String date_name = (1900 + date.getYear()) + "" + (date.getMonth() + 1) + "" + date.getDate() + "" + date.getHours() + "" + date.getMinutes() + "" + date.getSeconds();
		
		String path = "/data/apache-tomcat-9.0.8/webapps/ROOT/common/r/upgma/" + date_name;
		
		File filePath = new File(path);
		
		if (!filePath.exists())
			filePath.mkdirs();
		
		String[] extension = file.getOriginalFilename().split("\\.");
		String file_name = date_name + "." + extension[extension.length - 1];
		
		try
		{
			file.transferTo(new File(path + "/" + file_name));
			RunUpgma runupgma = new RunUpgma();
			runupgma.MakeRunUpgma(date_name, file_name);
		}
        catch(IOException e)
        {
        	System.out.println("error");
        }
		
		return "common/r/upgma/" + date_name + "/" + date_name;
	}
}