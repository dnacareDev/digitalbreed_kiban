package kr.or.ih.api.web;

import java.io.File;
import java.io.IOException;
import java.util.Date;
import java.util.List;
import java.util.concurrent.CompletableFuture;

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
import kr.or.ih.api.service.SpecificmakerService;

@Controller
public class SpecificMakerController 
{
	@Autowired
	private SpecificmakerService service;
	
	@Autowired
	private HomeService homeService;
	
	@RequestMapping("/specificmaker")
	public ModelAndView Specificmaker(ModelAndView mv, HttpServletRequest request, @RequestParam(value = "page_num", defaultValue = "1") int page_num)
	{
		HttpSession session = request.getSession();
		//if(session.getAttribute("user") == null)
		//{
		//	mv.setViewName("redirect:/login");
		//}
		//else
		//{
			User user = (User)session.getAttribute("user");
			System.out.println("User info " + user);
			//int count = service.SelectOutcomeCount(user.getUser_username());
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
			mv.setViewName("specificmaker/specificmaker_list");
		//}
		
		return mv;
	}
	
	@RequestMapping("/specificmaker_detail")
	public ModelAndView SpecificmakerDetail(ModelAndView mv, HttpServletRequest request, @RequestParam("outcome_id") int outcome_id)
	{
		HttpSession session = request.getSession();

		//if(session.getAttribute("user") == null)
		//{
		//	mv.setViewName("redirect:/login");
		//}
		//else
		//{
			User user = (User)session.getAttribute("user");
			
			int delete = homeService.DeleteNotice(user.getUser_username(), outcome_id);

			Outcome outcome = service.SelectOutcome(outcome_id);
			
			List<Notice> notice = homeService.SelectNotice(user.getUser_username());

			mv.addObject("outcome", outcome);
			mv.addObject("notice", notice);
			
			mv.setViewName("specificmaker/specificmaker_detail");
		//}
		
		return mv;
	}
	
	@RequestMapping("/specificmaker_add")
	public ModelAndView SpecificmakerAdd(ModelAndView mv, HttpServletRequest request)
	{
		HttpSession session = request.getSession();

		//if(session.getAttribute("user") == null)
		//{
		//	mv.setViewName("redirect:/login");
		//}
		//else
		//{
			User user = (User)session.getAttribute("user");

			List<Notice> notice = homeService.SelectNotice(user.getUser_username());

			mv.addObject("notice", notice);
			
			mv.setViewName("specificmaker/specificmaker_add");
		//}

		return mv;
	}
	
	@ResponseBody
	@RequestMapping("insertSpecific")
	public String InsertSpecific(@RequestParam("main_file") MultipartFile main_file, @RequestParam(required = false, value = "option_file") MultipartFile option_file)
	{
		Date date = new Date();
		String date_name = (1900 + date.getYear()) + "" + (date.getMonth() + 1) + "" + date.getDate() + "" + date.getHours() + "" + date.getMinutes() + "" + date.getSeconds();
		
		String path = "/data/apache-tomcat-9.0.8/webapps/ROOT/common/r/marker/" + date_name;
		
		File filePath = new File(path);
		
		if (!filePath.exists())
			filePath.mkdirs();
		
		try
		{
			String[] main_extension = main_file.getOriginalFilename().split("\\.");
			String main_name = date_name + "." + main_extension[main_extension.length - 1];
			
			main_file.transferTo(new File(path + "/" + main_name));
			
			RunMinimalMarker runminimalmarker = new RunMinimalMarker();
			
			if(option_file.isEmpty())
			{
				CompletableFuture.runAsync(() -> {
					runminimalmarker.MakeRunMinimalMarker(date_name, main_name);
				});
			}
			else
			{
				String[] option_extension = option_file.getOriginalFilename().split("\\.");
				String option_name = date_name + "." + option_extension[option_extension.length - 1];
				
				CompletableFuture.runAsync(() -> {
						String message = "";
						
						try
						{
							option_file.transferTo(new File(path + "/" + option_name));
						}
						catch (IllegalStateException e)
						{
							message = "R_error";
						}
						catch (IOException e)
						{
							message = "R_error";
						}
					
					runminimalmarker.MakeRunMinimalMarker_option(date_name, main_name, option_name);
				});
				
			}
		}
        catch(IOException e)
        {
        	System.out.println("error");
        }
		
		return date_name;
	}
}